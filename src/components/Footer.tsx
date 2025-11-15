const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Connecta. Tous droits réservés.
          </div>
          <div className="text-sm text-muted-foreground">
            Développé par <span className="font-medium text-foreground">Emna Awini</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
