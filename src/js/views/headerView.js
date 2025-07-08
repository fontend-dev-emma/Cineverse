class HeaderView {
  _header = document.getElementById('header');
  _heroScrollEndContent = document.querySelector('.header-scroll-end-content');

  _menuBtn = document.getElementById('menu-btn');
  _mobileMenuDropdownLink = document.getElementById(
    'mobile-menu-dropdown-links'
  );

  addHeaderMenuToggle() {
    this._menuBtn.addEventListener('click', () => {
      this._mobileMenuDropdownLink.classList.toggle('hidden');

      // Optional: change icon between open/close
      const icon = this._menuBtn.querySelector('i');
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    });
  }

  /**
   * @description --- it Observes the Viewport add and remove the sticky class on the header to make the header sticky ones on a setting point on the TopCoins container
   */
  // To make the header sticky on Mobile View
  viewObserver() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          this._header.classList.add(
            'fixed',
            'top-0',
            'left-0',
            'right-0',
            'z-50',
            'shadow-lg'
          );
        } else {
          this._header.classList.remove(
            'fixed',
            'top-0',
            'left-0',
            'right-0',
            'shadow-lg'
          );
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    observer.observe(this._heroScrollEndContent);
  }
}

export default new HeaderView();
