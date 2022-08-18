#!/bin/bash

unknown_os ()
{
  echo "Unfortunately, your operating system distribution and version are not supported by this script."
  echo
  echo "You can override the OS detection by setting os= and dist= prior to running this script."
  echo
  echo "For example, to force Ubuntu Trusty: os=ubuntu dist=trusty ./script.sh"
  echo
  exit 1
}

detect_os ()
{
  if [[ ( -z "${os}" ) && ( -z "${dist}" ) ]]; then
    # some systems dont have lsb-release yet have the lsb_release binary and
    # vice-versa
    if [ -e /etc/lsb-release ]; then
      . /etc/lsb-release

      if [ "${ID}" = "raspbian" ]; then
        os=${ID}
        dist=`cut --delimiter='.' -f1 /etc/debian_version`
      else
        os=${DISTRIB_ID}
        dist=${DISTRIB_CODENAME}

        if [ -z "$dist" ]; then
          dist=${DISTRIB_RELEASE}
        fi
      fi

    elif [ `which lsb_release 2>/dev/null` ]; then
      dist=`lsb_release -c | cut -f2`
      os=`lsb_release -i | cut -f2 | awk '{ print tolower($1) }'`

    elif [ -e /etc/debian_version ]; then
      # some Debians have jessie/sid in their /etc/debian_version
      # while others have '6.0.7'
      os=`cat /etc/issue | head -1 | awk '{ print tolower($1) }'`
      if grep -q '/' /etc/debian_version; then
        dist=`cut --delimiter='/' -f1 /etc/debian_version`
      else
        dist=`cut --delimiter='.' -f1 /etc/debian_version`
      fi

    else
      unknown_os
    fi
  fi

  if [ -z "$dist" ]; then
    unknown_os
  fi

  # remove whitespace from OS and dist name
  os="${os// /}" | tr "[:upper:]" "[:lower:]"
  dist="${dist// /}" | tr "[:upper:]" "[:lower:]"

  echo "Detected operating system as $os/$dist."
}

detect_version_id () {
  # detect version_id and round down float to integer
  if [ -f /etc/os-release ]; then
    . /etc/os-release
    version_id=${VERSION_ID%%.*}
  elif [ -f /usr/lib/os-release ]; then
    . /usr/lib/os-release
    version_id=${VERSION_ID%%.*}
  else
    version_id="1"
  fi

  echo "Detected version id as $version_id"
}
set_working_dir ()
{
  working_dir="$(cd -P "$(dirname -- "${BASH_SOURCE}")" >/dev/null 2>&1 && pwd)"

  echo "Working dir is $working_dir"
  echo
}

get_sudo_password ()
{
  # Ask for the administrator password upfront
  sudo -v

  # Keep-alive: update existing sudo time stamp until the script has finished
  while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &
}

setup_dependencies ()
{
  echo "Installing dependencies..."
  if [ "${os,,}" = "arch" ]; then
    sudo pacman -S --noconfirm --needed build-essential libxml2-dev libxslt-dev libcurl4-openssl-dev libicu-dev
    echo "Depedencies installed on ${os}"
  elif [ "${os,,}" = "centos" ] || [ "${os,,}" = "rhel" ]; then
    sudo yum -y -q install epel-release
    sudo yum -y -q install build-essential libxml2-dev libxslt-dev libcurl4-openssl-dev libicu-dev
    echo "Depedencies installed on ${os}"
  elif [ "${os,,}" = "debian" ] || [ "${os,,}" = "ubuntu" ]; then
    sudo apt-get -y -qq install build-essential libxml2-dev libxslt-dev libcurl4-openssl-dev libicu-dev
    echo "Depedencies installed on ${os}"
  else
    echo "Dependencies cannot be installed on ${os}"
  fi
  echo
}

create_python_env () {
  if [ -d "${working_dir}/.env" ]; then
    echo "Virtual environment already exists. Deleting..."
    rm -rf "${working_dir}/.env"
  fi
  echo
  echo "Creating Python virtual env in ${working_dir}/.env"
  /usr/bin/python3 -m venv $working_dir/.env
  source $working_dir/.env/bin/activate
  python3 -m pip install -r $working_dir/requirements.txt
  echo "Python virtual env created."
  echo
}

create_desktop_file ()
{
  if [ -f "/usr/share/applications/osmo-gui.desktop" ]; then
    echo "Desktop file already exists. Deleting..."
    sudo rm -f "/usr/share/applications/osmo-gui.desktop"
  fi
  echo "Creating desktop file..."
  sudo cat > $working_dir/osmo-gui.desktop << EOF
[Desktop Entry]
Version=1.0
Name=Osmocom
Comment=Open source mobile communications
Exec=${working_dir}/osmo-gui
Icon=${working_dir}/static/images/osmocom_icon.png
Type=Application
Categories=Development;HamRadio;Science;
Keywords=SDR;Radio;HAM;RF;
MimeType=application/gnuradio-grc;
Terminal=false

EOF
  chmod +x $working_dir/osmo-gui.desktop
  sudo cp $working_dir/osmo-gui.desktop /usr/share/applications/osmo-gui.desktop
  rm $working_dir/osmo-gui.desktop
  echo "Desktop file created."
  echo
}

create_program_file ()
{
  echo "Creating program..."
  if [ -f "${working_dir}/osmo-gui" ]; then
    rm "${working_dir}/osmo-gui"
  fi
  cat > ${working_dir}/osmo-gui << EOF
#!${working_dir}/.env/bin/python3
import webview
import subprocess
import time

django = subprocess.Popen(
    ["${working_dir}/.env/bin/python3", "${working_dir}/manage.py", "runserver", "127.0.0.1:8900"], )
time.sleep(1)
webview.create_window(
    "Osmocom",
    "http://localhost:8900/hlr/",
    confirm_close=True,
    width=1366,
    height=768,
    min_size=(800, 600),
)
webview.start()
django.terminate()

if __name__ == "__main__":
    pass

EOF
  chmod +x ${working_dir}/osmo-gui
  echo "osmo-gui created."
  echo
}

create_shortcut ()
{
  echo "Creating shortcut..."
  if [ -f "/usr/bin/osmo-gui" ]; then
    echo "Shortcut already exists. Deleting..."
    sudo rm -rf "/usr/bin/osmo-gui" 
    echo "Creating new shortcut..."
  fi
  sudo ln -s ${working_dir}/osmo-gui /usr/bin/osmo-gui
  echo "Shortcut created."
  echo
}

main ()
{
  detect_os
  detect_version_id
  set_working_dir
  echo "Welcome to the Osmocom GUI installer!"
  echo "This script will install the Osmocom GUI on your system."
  echo "Note that this program requires OsmoHLR version 1.5.0"
  echo "If you have not installed OsmoHLR yet,
  please do so now and then run this script again."
  echo "Press enter to continue or ctrl+c to exit."
  read -r
  get_sudo_password
  setup_dependencies
  echo "-----------------------------------------------------"
  create_python_env
  echo "-----------------------------------------------------"
  create_program_file
  create_desktop_file
  create_shortcut
  echo "-----------------------------------------------------"
  echo "Ready to go!"
  echo "To start the program, run 'osmo-gui'"
}
main