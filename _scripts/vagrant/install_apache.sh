#!/bin/bash
# Installs Apache2 Webserver into Ubuntu 14.04

# Gets projectname from vagrantfile
PROJECTNAME=$1

# Update apt and install apache
apt-get update
apt-get install -y apache2

# Symlink project dir into web dir
if ! [ -L /var/www ]; then
  rm -rf /var/www
  ln -fs /var/source /var/www
fi

# Enable mods 
a2enmod rewrite
a2enmod status
a2enmod deflate
a2enmod headers
a2enmod expires

# Disable the default site and write a new config
a2dissite 000-default

cat << EOF > /etc/apache2/sites-available/${PROJECTNAME}.conf

<VirtualHost *:80>
	DocumentRoot /var/www/public
	ServerName SERVERNAME.dev
	ErrorLog /var/log/error.log
	<Directory /var/www/public>
		Options +FollowSymLinks
		AllowOverride All
		#Require all granted
	</Directory>
</VirtualHost>
EOF
sed -i.tmp "s/SERVERNAME/${PROJECTNAME}/g" /etc/apache2/sites-available/${PROJECTNAME}.conf 
a2ensite ${PROJECTNAME}.conf

service apache2 reload
service apache2 restart

# Make sure rights are correct on Apache level (for generating logs, files in Drupal, etc.)
sed -i "s/export APACHE_RUN_USER=.*/export APACHE_RUN_USER=vagrant/" /etc/apache2/envvars
sed -i "s/export APACHE_RUN_GROUP=.*/export APACHE_RUN_GROUP=vagrant/" /etc/apache2/envvars
