/**
 * Slide up/down
 * Code from https://dev.to/bmsvieira/vanilla-js-slidedown-up-4dkn
 * @param target 
 * @param duration 
 */
let slideUp = (target: HTMLElement, duration = 500) => {
    target.classList.add('transiting');
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    ///target.style.boxSizing = 'border-box';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = "0";
    target.style.paddingTop = "0";
    target.style.paddingBottom = "0";
    target.style.marginTop = "0";
    target.style.marginBottom = "0";
    window.setTimeout(() => {
        target.classList.remove('show')
        target.style.removeProperty('height');
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        target.classList.remove('transiting');
    }, duration);
}

let slideDown = (target: HTMLElement, duration = 500) => {
    target.classList.add('transiting');
    target.style.removeProperty('display');

    target.classList.add('show');

    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = "0";
    target.style.paddingTop = "0";
    target.style.paddingBottom = "0";
    target.style.marginTop = "0";
    target.style.marginBottom = "0";
    target.offsetHeight;
    ///target.style.boxSizing = 'border-box';
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
        target.style.removeProperty('height');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        target.classList.remove('transiting');
    }, duration);
}

let slideToggle = (target, duration = 500) => {
    if (window.getComputedStyle(target).display === 'none') {
        return slideDown(target, duration);
    } else {
        return slideUp(target, duration);
    }
}

let isHomepage = () => {
    const normalizedPath = `${window.location.pathname.replace(/\/+$/, '')}/`;
    return normalizedPath === '/' || normalizedPath === '/en/';
}

export default function () {
    const toggleMenu = document.getElementById('toggle-menu');
    const mainMenu = document.getElementById('main-menu');
    const mobileMenu = window.matchMedia('(max-width: 767px)');
    const mobilePreopenClass = 'mobile-menu-preopen';
    const sidebarNavigationKey = 'leftjun-mobile-menu-nav';
    let autoCollapseTimer: number | undefined;
    let userToggled = false;

    const consumeSidebarNavigation = () => {
        try {
            const shouldPreopen = window.sessionStorage.getItem(sidebarNavigationKey) === '1';
            window.sessionStorage.removeItem(sidebarNavigationKey);
            return shouldPreopen;
        } catch (error) {
            return false;
        }
    };

    const openMenu = () => {
        document.body.classList.add('show-menu');
        mainMenu?.classList.add('show');
        toggleMenu?.classList.add('is-active');
        document.documentElement.classList.remove(mobilePreopenClass);
    };

    const closeMenu = () => {
        if (!mainMenu) return;

        document.body.classList.remove('show-menu');
        document.documentElement.classList.remove(mobilePreopenClass);
        toggleMenu?.classList.remove('is-active');

        if (window.getComputedStyle(mainMenu).display !== 'none') {
            slideUp(mainMenu, 300);
        } else {
            mainMenu.classList.remove('show');
        }
    };

    if (toggleMenu) {
        toggleMenu.addEventListener('click', () => {
            if (!mainMenu || mainMenu.classList.contains('transiting')) return;

            userToggled = true;
            if (autoCollapseTimer) {
                window.clearTimeout(autoCollapseTimer);
            }
            document.documentElement.classList.remove(mobilePreopenClass);

            document.body.classList.toggle('show-menu');
            slideToggle(mainMenu, 300);
            toggleMenu.classList.toggle('is-active');
        });
    }

    if (mainMenu) {
        mainMenu.querySelectorAll('a[href]').forEach((link) => {
            link.addEventListener('click', () => {
                if (!mobileMenu.matches || !document.body.classList.contains('show-menu')) return;

                const anchor = link as HTMLAnchorElement;
                const target = anchor.getAttribute('target');
                const href = anchor.getAttribute('href');

                if (!href || target === '_blank') return;

                try {
                    const url = new URL(anchor.href, window.location.href);
                    if (url.origin !== window.location.origin) return;
                    window.sessionStorage.setItem(sidebarNavigationKey, '1');
                } catch (error) {
                    window.sessionStorage.removeItem(sidebarNavigationKey);
                }
            });
        });
    }

    if (toggleMenu && mainMenu && mobileMenu.matches) {
        const fromSidebarNavigation = consumeSidebarNavigation();
        const shouldPreopen = isHomepage() || fromSidebarNavigation;

        if (!shouldPreopen) {
            document.documentElement.classList.remove(mobilePreopenClass);
            return;
        }

        openMenu();
        autoCollapseTimer = window.setTimeout(() => {
            if (userToggled || mainMenu.classList.contains('transiting')) return;
            closeMenu();
        }, isHomepage() ? 500 : 0);
    } else {
        document.documentElement.classList.remove(mobilePreopenClass);
        consumeSidebarNavigation();
    }
}
