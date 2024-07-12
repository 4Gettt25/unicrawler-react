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
        # Override the watchfiles package to skip tests
        pythonWithOverrides = python.override {
          packageOverrides = self: super: {
            watchfiles = super.watchfiles.overridePythonAttrs (oldAttrs: {
              doCheck = false; # Disable test phase for watchfiles
            });
          };
        };
      in
      {
        devShell = pkgs.mkShell {
          # Define Python packages to install
          buildInputs = [
            python
            pkgs.poppler
            pkgs.poppler_utils
            pkgs.git
            pkgs.nodejs
            pkgs.virtualenv
            pythonWithOverrides.pkgs.pip
            pythonWithOverrides.pkgs.requests
            pythonWithOverrides.pkgs.pytest
            pythonWithOverrides.pkgs.pytest-mock
            pythonWithOverrides.pkgs.flask
            pythonWithOverrides.pkgs.flask-cors
            pythonWithOverrides.pkgs.openpyxl
            pythonWithOverrides.pkgs.pandas
            pythonWithOverrides.pkgs.numpy
            pythonWithOverrides.pkgs.beautifulsoup4
            pythonWithOverrides.pkgs.sqlalchemy
            pythonWithOverrides.pkgs.pdfminer
            pythonWithOverrides.pkgs.pymupdf
            pythonWithOverrides.pkgs.pypdf2
            pythonWithOverrides.pkgs.pdf2image
            pythonWithOverrides.pkgs.pillow
            pythonWithOverrides.pkgs.whoosh
            # Add the overridden watchfiles package
            pythonWithOverrides.pkgs.watchfiles
          ];
          shellHook = ''
            export PROJECT_PATH=~/python_projects/unicrawler-react
            cd $PROJECT_PATH
            if [ -d .git ]; then
              echo "Pulling latest changes from the Git repository..."
              git pull
            else
              echo "No Git repository found in $PROJECT_PATH"
            fi
          '';
        };
      });
}
