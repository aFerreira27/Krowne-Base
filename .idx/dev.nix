# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.11"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.yarn
    pkgs.nil
    pkgs.nixpkgs-fmt
    pkgs.git-filter-repo
    pkgs.zulu

    # Python 3.12 with venv support
    (pkgs.python312.withPackages (ps: [
      ps.pip
    ]))
  ];

  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [];

    workspace = {
      onCreate = {
        default.openFiles = [ "/home/user/studio/src/app/page.tsx" ];
      };
    };
  };

  # If you have services to define, they would typically go here as a top-level attribute
  # services = [ ];
}
