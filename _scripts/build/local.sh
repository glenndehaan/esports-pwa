#!/bin/bash -l

echo "Building local project"

# Navigate to actual main directory (no mather where this script gets executed)
current_dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd ${current_dir}/../../

# Create .vagrantuser file (Rename paramters in file with dynamic magic)
echo "Creating & replacing .vagrantuser file"
project_name_dashes=$(echo ${PWD##*/} | sed 's/_/-/g')
project_absolute_path=$(echo ${PWD})
printf '# Use only / slashes otherwise it will be interpreted as escape character\nproject:\n    name: "'${project_name_dashes}'"\n    local_git_path: "'${project_absolute_path}'"\n    provider: "virtualbox"\n    ip_address: 192.168.50.2\n    vagrant_max_memory: 1024' > .vagrantuser
