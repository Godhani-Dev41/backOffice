   curl -L -o google-chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
   sudo dpkg -i google-chrome.deb
   sudo sed -i 's|HERE/chrome\"|HERE/chrome\" --disable-setuid-sandbox|g' /opt/google/chrome/google-chrome
   rm google-chrome.deb
   npm install -g npm-run-all typings webdriver-manager
   npm install -g protractor
   sudo apt-get update
   sudo apt-get install google-chrome-stable
