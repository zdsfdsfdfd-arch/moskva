# Деплой на VPS Hostinger (Ubuntu), путь sitesameday.com/clear

> Быстрая альтернатива для предпросмотра — GitHub Pages: включается одним
> переключателем (Settings → Pages → Source: GitHub Actions), дальше всё
> собирается само при каждом push в `main`. Но Pages отдаёт только статику,
> поэтому приём заявок там не работает — для этого нужен VPS ниже.

Сайт ставится рядом с основным: nginx продолжает отдавать основной сайт на `/`,
а всё, что начинается с `/clear`, проксирует в приложение Next.js на
`127.0.0.1:3100`. Основной сайт при этом не трогается.

Путь `/clear` задаётся одной переменной и меняется в любой момент — см. раздел
«Сменить путь».

---

## 0. Что должно быть

- VPS с Ubuntu и root-доступом по SSH (IP и пароль — в hPanel Hostinger).
- Домен `sitesameday.com` уже указывает на этот VPS, основной сайт работает по HTTPS.
- Установлен nginx (проверка: `nginx -v`).

Все команды ниже выполняются на сервере от root. Подключение с вашего компьютера:

```bash
ssh root@IP_СЕРВЕРА
```

---

## 1. Node.js 20+

```bash
node -v
```

Если команда не найдена или версия ниже 20:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node -v   # должно быть v20.x или новее
```

---

## 2. Загрузить файлы

Вариант А — клонировать репозиторий (удобнее всего: обновления потом одной
командой `git pull`):

```bash
apt-get install -y git
mkdir -p /var/www
git clone https://github.com/zdsfdsfdfd-arch/moskva.git /var/www/blik
ls /var/www/blik            # должен быть package.json
```

Если репозиторий приватный, понадобится deploy key или токен доступа —
проще сделать его публичным либо воспользоваться вариантом Б.

Вариант Б — загрузить архив с вашего компьютера (PowerShell на Windows, из
папки со скачанным файлом):

```powershell
scp blik-site-src.zip root@IP_СЕРВЕРА:/root/
```

Дальше на сервере:

```bash
apt-get install -y unzip
mkdir -p /var/www
unzip -q /root/blik-site-src.zip -d /root/blik-unzip
mv /root/blik-unzip/blik-site /var/www/blik
rm -rf /root/blik-unzip /root/blik-site-src.zip
ls /var/www/blik            # должен быть package.json
```

Вариант В — через File Manager в hPanel: загрузить архив, распаковать,
перенести содержимое в `/var/www/blik`.

## 3. Настройки сайта

Создать файл `/var/www/blik/.env.production`:

```bash
cat > /var/www/blik/.env.production <<'EOF'
NEXT_PUBLIC_BASE_PATH=/clear
NEXT_PUBLIC_SITE_URL=https://sitesameday.com/clear
EOF
```

Эти две переменные читаются и при сборке, и при запуске. `NEXT_PUBLIC_BASE_PATH`
заставляет Next отдавать все ссылки и ассеты с префиксом `/clear`,
`NEXT_PUBLIC_SITE_URL` попадает в canonical, sitemap и Open Graph.

Приём заявок (необязательно, по умолчанию форма работает в демо-режиме и честно
об этом пишет). Чтобы заявки уходили, добавить в тот же файл одну из строк:

```
LEAD_WEBHOOK_URL=https://ваш-webhook
# или
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_CHAT_ID=-1001234567890
```

---

## 4. Сборка

```bash
cd /var/www/blik
npm ci --no-audit --no-fund
npm run build
```

Сборка занимает одну-три минуты. Если процесс падает с `Killed` или
`JavaScript heap out of memory` — на сервере мало оперативной памяти, добавьте
swap и повторите:

```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

Права для сервисного пользователя:

```bash
chown -R www-data:www-data /var/www/blik
```

---

## 5. Автозапуск через systemd

```bash
cp /var/www/blik/deploy/blik.service /etc/systemd/system/blik.service
systemctl daemon-reload
systemctl enable --now blik
systemctl status blik --no-pager
```

Должно быть `active (running)`. Проверка, что приложение отвечает локально:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3100/clear
```

Ожидаемый ответ — `200`.

Логи, если что-то не так:

```bash
journalctl -u blik -n 50 --no-pager
```

Порт 3100 слушается только на localhost, наружу он не открыт и в firewall его
открывать не нужно.

---

## 6. nginx

Найти конфиг основного сайта:

```bash
grep -rl "sitesameday.com" /etc/nginx/sites-available/ /etc/nginx/conf.d/ 2>/dev/null
```

Открыть найденный файл, найти блок `server { ... }`, который слушает
`443 ssl` для `sitesameday.com`, и вставить внутрь него содержимое
`/var/www/blik/deploy/nginx-clear.conf` — рядом с существующим `location /`.

Готовый блок для копирования лежит в файле; коротко он выглядит так:

```nginx
location ^~ /clear {
    proxy_pass http://127.0.0.1:3100;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Модификатор `^~` обязателен: без него регулярные `location` основного сайта
(например, обработка `.php`) могут перехватить запросы к `/clear`.

Проверить и применить:

```bash
nginx -t && systemctl reload nginx
```

`nginx -t` должен написать `syntax is ok` и `test is successful`. Если нет —
конфиг не применится, основной сайт продолжит работать как раньше.

---

## 7. Проверка

Откройте в браузере:

- https://sitesameday.com/clear — главная
- https://sitesameday.com/clear/privacy — политика
- https://sitesameday.com — основной сайт должен работать как прежде

Если стили и картинки не загрузились, а страница белая — значит
`NEXT_PUBLIC_BASE_PATH` не совпал с путём в nginx. Проверьте, что в
`.env.production` написано ровно `/clear`, и пересоберите (`npm run build`,
`systemctl restart blik`): этот параметр вшивается в сборку, менять его
перезапуском недостаточно.

---

## 8. Обновление после правок

Если сайт клонирован из репозитория:

```bash
cd /var/www/blik && git pull
sudo bash deploy/update.sh
```

Если файлы заливаются вручную — просто заменить их и выполнить:

```bash
sudo bash /var/www/blik/deploy/update.sh
```

Скрипт ставит зависимости, пересобирает, чинит права, перезапускает сервис и
проверяет, что сайт отвечает. Файл `.env.production` он не трогает.

---

## 9. Сменить путь

Например, на `/okna`:

```bash
sed -i 's#/clear#/okna#g' /var/www/blik/.env.production
sed -i 's#/clear#/okna#g' /etc/nginx/sites-available/ВАШ_КОНФИГ
cd /var/www/blik && npm run build && systemctl restart blik
nginx -t && systemctl reload nginx
```

Если позже сайт переедет на отдельный домен или поддомен и будет жить в корне —
оставьте `NEXT_PUBLIC_BASE_PATH` пустым и уберите `/clear` из
`NEXT_PUBLIC_SITE_URL`.

---

## 10. Поисковые системы

Файл `robots.txt` поисковики читают только в корне домена, поэтому
`/clear/robots.txt` они проигнорируют. Чтобы карта сайта попала в индекс,
допишите в `robots.txt` основного сайта строку:

```
Sitemap: https://sitesameday.com/clear/sitemap.xml
```

Пока сайт демонстрационный (вымышленный бренд, заглушки вместо контактов), его
разумнее держать закрытым от индексации: добавьте в тот же `robots.txt`

```
Disallow: /clear
```

и снимите запрет, когда появятся реальные данные компании.

---

## Типичные проблемы

| Симптом | Причина и что делать |
|---|---|
| `502 Bad Gateway` на `/clear` | Приложение не запущено: `systemctl status blik`, `journalctl -u blik -n 50` |
| Страница открылась, но без стилей | `NEXT_PUBLIC_BASE_PATH` не совпадает с путём в nginx; исправить и пересобрать |
| `/clear` отдаёт 404 от основного сайта | В nginx нет `^~` или блок вставлен не в тот `server` |
| `Error: listen EADDRINUSE :::3100` | Порт занят: сменить его в `deploy/blik.service` и в `nginx-clear.conf`, перезапустить оба |
| Сборка падает с `Killed` | Не хватает памяти — добавить swap (раздел 4) |
| Форма пишет «режим демонстрации» | Это ожидаемо, пока не заданы `LEAD_WEBHOOK_URL` или Telegram-переменные |
