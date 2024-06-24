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
      in
      {
        devShell = pkgs.mkShell {
          # List your development dependencies here
          buildInputs = [
            pkgs.python3
            pkgs.python3Packages.pip
            pkgs.git
            pkgs.nodejs
          ];

          # Any additional shell setup can go here
          shellHook = ''
            export PROJECT_PATH=/home/felixg/python_projects/unicrawler
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
