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
    let autoCollapseTimer: number | undefined;
    let userToggled = false;

    if (toggleMenu && mainMenu && mobileMenu.matches && isHomepage()) {
        document.body.classList.add('show-menu');
        mainMenu.classList.add('show');
        toggleMenu.classList.add('is-active');

        autoCollapseTimer = window.setTimeout(() => {
            if (userToggled || mainMenu.classList.contains('transiting')) return;

            document.body.classList.remove('show-menu');
            slideUp(mainMenu, 300);
            toggleMenu.classList.remove('is-active');
        }, 1000);
    }

    if (toggleMenu) {
        toggleMenu.addEventListener('click', () => {
            if (!mainMenu || mainMenu.classList.contains('transiting')) return;

            userToggled = true;
            if (autoCollapseTimer) {
                window.clearTimeout(autoCollapseTimer);
            }

            document.body.classList.toggle('show-menu');
            slideToggle(mainMenu, 300);
            toggleMenu.classList.toggle('is-active');
        });
    }
}
