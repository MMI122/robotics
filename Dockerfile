FROM php:8.2-fpm-alpine AS base

# Install system dependencies and PHP extensions
RUN apk add --no-cache \
    bash \
    curl \
    git \
    unzip \
    libpng libpng-dev \
    libjpeg-turbo libjpeg-turbo-dev \
    libwebp libwebp-dev \
    libzip libzip-dev \
    oniguruma oniguruma-dev \
    icu-dev \
    mariadb-connector-c-dev \
    postgresql-dev \
    linux-headers \
    shadow \
&& docker-php-ext-configure gd --with-jpeg --with-webp \
&& docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_mysql \
    pdo_pgsql \
    mbstring \
    zip \
    intl \
    gd \
    opcache

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy backend code only for smaller image
COPY backend /app

# Set production PHP settings
RUN cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini \
 && sed -i 's/memory_limit = .*/memory_limit = 256M/' /usr/local/etc/php/php.ini \
 && sed -i 's/upload_max_filesize = .*/upload_max_filesize = 20M/' /usr/local/etc/php/php.ini \
 && sed -i 's/post_max_size = .*/post_max_size = 20M/' /usr/local/etc/php/php.ini

# Install PHP dependencies
RUN composer install --no-dev --prefer-dist --optimize-autoloader

# Ensure storage and cache directories are writable
RUN mkdir -p storage/framework/{cache,views,sessions} storage/app/public \
 && chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R 775 storage bootstrap/cache

ENV PORT=8080

# Expose port for Koyeb
EXPOSE 8080

# Create a basic .env file for Laravel with APP_KEY
RUN touch .env && echo "APP_KEY=base64:je5QufSs/V5ov2GWckNSOafJWS/ZWZZf1wpPHyctJWQ=" >> .env

# Entrypoint: drop all tables, run migrations in correct order, storage link, then serve
CMD php artisan migrate:fresh --force \
 && php artisan migrate --path=database/migrations/0001_01_01_000001_create_cache_table.php --force \
 && php artisan migrate --path=database/migrations/0001_01_01_000000_create_users_table.php --force \
 && php artisan migrate --path=database/migrations/0001_01_01_000002_create_jobs_table.php --force \
 && php artisan migrate --path=database/migrations/2025_10_03_131615_create_categories_table.php --force \
 && php artisan migrate --path=database/migrations/2025_10_03_131616_create_products_table.php --force \
 && php artisan migrate --path=database/migrations/2025_10_03_131658_create_orders_table.php --force \
 && php artisan migrate --path=database/migrations/2025_10_03_131724_create_order_items_table.php --force \
 && php artisan migrate --path=database/migrations/2025_10_03_131743_create_carts_table.php --force \
 && php artisan migrate --path=database/migrations/2025_10_03_131756_create_reviews_table.php --force \
 && php artisan migrate --path=database/migrations/2025_10_03_131818_create_wishlists_table.php --force \
 && php artisan migrate --path=database/migrations/2025_10_03_131842_create_supports_table.php --force \
 && php artisan migrate --path=database/migrations/2025_10_03_140008_create_personal_access_tokens_table.php --force \
 && php artisan migrate --path=database/migrations/2025_10_17_052258_add_tier_to_users_table.php --force \
 && php artisan migrate --path=database/migrations/2025_10_17_062711_add_vip_to_user_tier_enum.php --force \
 && php artisan migrate --path=database/migrations/2025_10_17_110203_update_payment_method_enum_in_orders_table.php --force \
 && php artisan migrate --path=database/migrations/2025_10_17_110251_update_payment_method_enum_in_orders_table.php --force \
 && php artisan db:seed --force \
 && php artisan storage:link || true \
 && php -S 0.0.0.0:$PORT -t public


