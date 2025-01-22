# Инструкция по запуску на сервере Ubuntu с использованием PM2

## Установка зависимостей

1. Убедитесь, что Node.js и npm установлены корректно:
    ```bash
    node -v
    npm -v
    ```
    ## Установка Node.js с использованием NVM

    1. Установите NVM (Node Version Manager):
        ```bash
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
        ```

    2. Активируйте NVM, добавив следующие строки в ваш файл `~/.bashrc`, `~/.zshrc` или другой файл конфигурации вашего шелла:
        ```bash
        export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
        ```

    3. Перезапустите ваш терминал или выполните команду для загрузки изменений:
        ```bash
        source ~/.bashrc
        ```

    4. Установите последнюю версию Node.js:
        ```bash
        nvm install node
        ```

    5. Убедитесь, что Node.js и npm установлены корректно:
        ```bash
        node -v
        npm -v
        ```

2. Установите PM2 глобально:
    ```bash
    sudo npm install -g pm2
    ```

## Клонирование репозитория

1. Клонируйте ваш проект на сервер:
    ```bash
    git clone <URL вашего репозитория>
    cd <название вашего репозитория>
    ```

## Установка зависимостей проекта

1. Установите зависимости вашего проекта:
    ```bash
    npm install
    ```

## Сборка проекта

1. Соберите проект:
    ```bash
    npm run build
    ```

## Запуск проекта с использованием PM2

1. Запустите ваш проект с помощью PM2:
    ```bash
    pm2 start ./dist/app.js
    ```

2. Сохраните текущую конфигурацию PM2, чтобы она автоматически восстанавливалась после перезагрузки сервера:
    ```bash
    pm2 save
    ```

3. Настройте PM2 на автозапуск при старте системы:
    ```bash
    pm2 startup
    sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
    ```

## Мониторинг и управление

- Для просмотра логов используйте:
    ```bash
    pm2 logs
    ```

- Для просмотра статуса всех процессов:
    ```bash
    pm2 list
    ```

- Для перезапуска процесса:
    ```bash
    pm2 restart <ID или имя процесса>
    ```

- Для остановки процесса:
    ```bash
    pm2 stop <ID или имя процесса>
    ```

- Для удаления процесса:
    ```bash
    pm2 delete <ID или имя процесса>
    ```

## Заключение

Теперь ваш проект настроен для работы на сервере Ubuntu с использованием PM2. Это обеспечит автоматический перезапуск вашего приложения в случае сбоев и после перезагрузки сервера.
## Установка Node.js с использованием NVM

1. Установите NVM (Node Version Manager):
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    ```

2. Активируйте NVM, добавив следующие строки в ваш файл `~/.bashrc`, `~/.zshrc` или другой файл конфигурации вашего шелла:
    ```bash
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
    ```

3. Перезапустите ваш терминал или выполните команду для загрузки изменений:
    ```bash
    source ~/.bashrc
    ```

4. Установите последнюю версию Node.js:
    ```bash
    nvm install node
    ```