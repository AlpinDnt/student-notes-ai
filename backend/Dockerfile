# ==========================================================
# Dockerfile - Laravel Backend (PHP-FPM)
# ==========================================================
FROM php:8.3-fpm-alpine

# Install dependencies sistem yang dibutuhkan ekstensi PHP & Composer
RUN apk add --no-cache \
    bash \
    curl \
    git \
    unzip \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    freetype-dev \
    libzip-dev \
    oniguruma-dev \
    icu-dev \
    mariadb-client \
    $PHPIZE_DEPS

# Konfigurasi & install ekstensi PHP yang dibutuhkan Laravel
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        opcache

# Install Composer (diambil dari image resmi composer)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy source code Laravel (saat pertama build; setelah itu di-override oleh volume bind mount)
COPY . .

# Install dependency PHP (skip jika composer.json belum ada saat scaffolding awal)
RUN if [ -f composer.json ]; then composer install --no-interaction --optimize-autoloader; fi

# Permission agar storage & bootstrap/cache bisa ditulis oleh www-data
RUN addgroup -g 1000 www \
    && adduser -G www -g www -s /bin/sh -D www \
    && chown -R www:www /var/www/html \
    && mkdir -p storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

USER www

EXPOSE 9000

CMD ["php-fpm"]