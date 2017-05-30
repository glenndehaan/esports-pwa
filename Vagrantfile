# -*- mode: ruby -*-
# vi: set ft=ruby :

# Do not make any changes in this file unless you know what you're doing.

# hostname plugin docs https://github.com/smdahlen/vagrant-hostmanager
# to install plugin execute: vagrant plugin install vagrant-hostmanager

# nugrant plugin for user environment specific variables docs: https://github.com/maoueh/nugrant
# to install plugin execute: vagrant plugin install nugrant

Vagrant.configure(2) do |config|

  # Enables hostmanager plugin
  config.hostmanager.enabled = true
  config.hostmanager.manage_host = true
  config.hostmanager.ignore_private_ip = false
  config.hostmanager.include_offline = true
  config.ssh.forward_agent = true

  # Make sure you put in 'ForwardAgent yes' as new line in your ~/.ssh/config file
  config.ssh.forward_agent = true

  # Set the projectname (variant with - instead of _) .dev is added automatically
  # map .vagrantuser settings
  projectname_string = config.user.project.name
  projectipaddress_string = config.user.project.ip_address
  projectdirectory_string = config.user.project.local_git_path

  # Set the directory where the project is cloned from git

  config.vm.define projectname_string do |projectname|
    # Load the base vagrant box
    projectname.vm.box = "ubuntu/trusty64"
    projectname.vm.synced_folder projectdirectory_string, "/var/source"

    # Install extra packages
    # Required packages

    # Utilities
    projectname.vm.provision :shell, path: "_scripts/vagrant/install_default_tools.sh"

    # Apache
    projectname.vm.provision :shell, path: "_scripts/vagrant/install_apache.sh", args: projectname_string

    # PHP5
    projectname.vm.provision :shell, path: "_scripts/vagrant/install_php5.sh"

    # NodeJS & NPM
    projectname.vm.provision :shell, path: "_scripts/vagrant/install_node_npm.sh"

    # Run environment specific post Install
    #projectname.vm.provision :shell, path: "_scripts/build/vagrant.sh"

    # Set the Hostname (default = projectname +.dev)
    projectname.vm.hostname = projectname_string+".dev"

    # Set the default ip (You cannot have multiple boxes running on the same host with the same ip)
    projectname.vm.network "private_network", ip: projectipaddress_string

    # Configure portforwarding for apache & browserSync (visit IP from client on the given port. Example: http://192.128.1.195:4567)
    projectname.vm.network :forwarded_port, host: 4567, guest: 80,  auto_correct: true
    projectname.vm.network :forwarded_port, host: 4000, guest: 4000,  auto_correct: true
    projectname.vm.network :forwarded_port, host: 3000, guest: 3000,  auto_correct: true
    projectname.vm.network :forwarded_port, host: 4001, guest: 4001,  auto_correct: true
    projectname.vm.network :forwarded_port, host: 8000, guest: 8000,  auto_correct: true

    # Set the Virtual Machine Settings
    projectname.vm.provider config.user.project.provider do |v|

      # Set the allowed memory
      v.memory = config.user.project.vagrant_max_memory

    end
  end
end

