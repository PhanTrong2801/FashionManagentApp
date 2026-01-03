FROM php:8.4-fpm

# 1. Cài đặt các thư viện hệ thống
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev # Thêm dòng này

# 2. Xóa cache apt để giảm dung lượng image
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# 3. Cài đặt các PHP extensions (Đã thêm zip)
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# 4. Cài Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www