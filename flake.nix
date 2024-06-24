{
  description = "A simple flake for a Python development environment";

  inputs = {
    # Nixpkgs repository for package definitions
    nixpkgs.url = "github:NixOS/nixpkgs";

    # Direnv integration
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
        python = pkgs.python310; # Use the desired Python version
      in
      {
        devShell = pkgs.mkShell {
          # List your development dependencies here
          buildInputs = [
            python
            pkgs.git
            pkgs.nodejs
            pkgs.virtualenv
          ];

          # Define Python packages to install
          PYTHON_PACKAGES = [
            python.pkgs.requests # example package, replace with your requirements
            python.pkgs.flask
            python.pkgs.numpy
            python.pkgs.BeautifulSoup4
            python.pkgs.sqlalchemy
            python.pkgs.pdfminer
          ];

          shellHook = ''
            export PROJECT_PATH=/home/felixg/python_projects/unicrawler-react
            cd $PROJECT_PATH
            if [ -d .git ]; then
              echo "Pulling latest changes from the Git repository..."
              git pull
            else
              echo "No Git repository found in $PROJECT_PATH"
            fi

            # Create and activate virtual environment
            if [ ! -d ".venv" ]; then
              virtualenv .venv
            fi
            source .venv/bin/activate

            # Install Python packages
            pip install ${builtins.concatStringsSep " " (map (p: "${p.outPath}") PYTHON_PACKAGES)}
            echo "Virtual environment activated and packages installed."
          '';
        };
      });
}
