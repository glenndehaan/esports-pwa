#!/bin/bash

# Install basic PHP with some basic modules
apt-get install -y php5 php5-mysql php5-curl php5-xdebug php5-gd php5-mcrypt

#set php.ini vars to development defaults
sed -i "s/error_reporting = .*/error_reporting = E_ALL/" /etc/php5/apache2/php.ini
sed -i "s/display_errors = .*/display_errors = On/" /etc/php5/apache2/php.ini
sed -i "s/display_startup_errors = .*/display_startup_errors = On/" /etc/php5/apache2/php.ini
sed -i "s/;sendmail_path.*/sendmail_path = sendmail -t -i/" /etc/php5/apache2/php.ini

#write xdebug vars
cat << EOF | sudo tee -a /etc/php5/mods-available/xdebug.ini
xdebug.remote_enable=1
xdebug.remote_connect_back=1
xdebug.profiler_enable_trigger=1
xdebug.profiler_output_dir=/var/www/app/logs
xdebug.profiler_output_name="xdebug_profiler.%R.%t"
xdebug.trace_enable_trigger=1
xdebug.trace_output_dir=/var/www/app/logs
xdebug.trace_output_name="xdebug_trace.%R.%t"
xdebug.trace_format=2
xdebug.idekey="PHPSTORM"
EOF

#enable xdebug/mcrypt mod
php5enmod xdebug
php5enmod mcrypt

service apache2 restart
rm -R /var/lock/apache2
service apache2 start
