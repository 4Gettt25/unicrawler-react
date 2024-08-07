{
  description = "A simple flake for a Python development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          config = {
            allowUnfree = true;
          };
          inherit system;
        };
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = [
            pkgs.google-chrome
            pkgs.cypress
            pkgs.glibc
            pkgs.google-chrome
            pkgs.stdenv.cc.cc.lib
            pkgs.gcc
            pkgs.libstdcxx5
            pkgs.cypress
            pkgs.supabase-cli
            pkgs.python310
            pkgs.virtualenv
            pkgs.poppler
            pkgs.poppler_utils
            pkgs.git
            pkgs.nodejs
            pkgs.deno
          ];

          shellHook = ''
            export PROJECT_PATH=~/python_projects/unicrawler-react
            export PATH=$PATH:${pkgs.google-chrome}/bin
            export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib:$LD_LIBRARY_PATH"

            if [ ! -d $PROJECT_PATH ]; then
              echo "Cloning Git repository..."
              git clone https://your.git.repo.url $PROJECT_PATH
            fi

            cd $PROJECT_PATH

            if [ -d .git ]; then
              echo "Pulling latest changes from the Git repository..."
              git pull
            else
              echo "No Git repository found in $PROJECT_PATH"
            fi

            if [ -f frontend/package.json ]; then
              echo "Installing npm dependencies in frontend directory..."
              cd frontend
              npm install
              cd ..
            else
              echo "No package.json found in frontend directory, skipping npm install"
            fi

            # Set up the Python virtual environment
            if [ ! -d venv ]; then
              python -m venv venv
            fi
            source venv/bin/activate
            echo "Entering Python virtual environment..."
            if [ -f $PROJECT_PATH/requirements.txt ]; then
              pip install -r $PROJECT_PATH/requirements.txt
            else
              echo "requirements.txt not found in $PROJECT_PATH"
            fi
            python -c "import requests" && echo "No errors!"

            # Set up the Supabase database
            echo "Starting Supabase database..."
            supabase start
          '';
        };
      });
}
