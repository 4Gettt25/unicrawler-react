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
          inherit system;
        };
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = [
            pkgs.python310
            pkgs.virtualenv
            pkgs.poppler
            pkgs.poppler_utils
            pkgs.git
            pkgs.nodejs
          ];

          shellHook = ''
            export PROJECT_PATH=~/python_projects/unicrawler-react
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
              pip install -r requirements.txt
            python -c "installing dependencies..."
          '';
        };
      });
}
