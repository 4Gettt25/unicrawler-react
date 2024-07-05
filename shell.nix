{
  # Import the flake and select the devShell
  pkgs ? import <nixpkgs> {},
  devShell ? (import ./flake.nix).outputs.defaultPackage.x86_64-linux.devShell
}:

devShell
