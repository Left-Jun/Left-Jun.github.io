import menu from './menu';
import createElement from './createElement';
import LeftJunColorScheme from './colorScheme';
import { setupScrollspy } from './scrollspy';
import { setupSmoothAnchors } from './smoothAnchors';

function setupCursorGlow() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const glowCards = document.querySelectorAll<HTMLElement>('.home-workflow__item');

    glowCards.forEach(card => {
        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;

            card.style.setProperty('--cursor-x', `${x}%`);
            card.style.setProperty('--cursor-y', `${y}%`);
        });

        card.addEventListener('pointerleave', () => {
            card.style.removeProperty('--cursor-x');
            card.style.removeProperty('--cursor-y');
        });
    });
}

let LeftJunSite = {
    init: () => {
        /**
         * Bind menu event
         */
        menu();
        setupCursorGlow();

        const articleContent = document.querySelector('.article-content') as HTMLElement;
        if (articleContent) {
            setupSmoothAnchors();
            setupScrollspy();
        }

        /**
         * Add copy button to code block
        */
        const highlights = document.querySelectorAll('.article-content div.highlight');
        const copyText = `Copy`,
            copiedText = `Copied!`;

        highlights.forEach(highlight => {
            const copyButton = document.createElement('button');
            copyButton.innerHTML = copyText;
            copyButton.classList.add('copyCodeButton');
            highlight.appendChild(copyButton);

            const codeBlock = highlight.querySelector('code[data-lang]');
            if (!codeBlock) return;

            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(codeBlock.textContent)
                    .then(() => {
                        copyButton.textContent = copiedText;

                        setTimeout(() => {
                            copyButton.textContent = copyText;
                        }, 1000);
                    })
                    .catch(err => {
                        alert(err)
                        console.log('Something went wrong', err);
                    });
            });
        });

        new LeftJunColorScheme(document.getElementById('dark-mode-toggle')!);
    }
}

window.addEventListener('load', () => {
    setTimeout(function () {
        LeftJunSite.init();
    }, 0);
})

declare global {
    interface Window {
        createElement: any;
        LeftJunSite: any
    }
}

window.LeftJunSite = LeftJunSite;
window.createElement = createElement;
