(function () {
    const basePath = document.currentScript.dataset.base || '';

    const NAV_ITEMS = [
        { href: 'index.html', label: 'Home', icon: 'home' },
        { href: 'cocktails.html', label: 'Cocktails', icon: 'local_bar' },
        { href: 'blog.html', label: 'Blog', icon: 'article' },
    ];

    const SOCIAL_LINKS = [
        {
            href: 'https://www.instagram.com/ataberk.canitez',
            svg: '<svg fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><rect height="20" rx="5" ry="5" width="20" x="2" y="2"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>',
        },
        {
            href: 'https://x.com/_ataberkcanitez',
            svg: '<svg fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M13.232 10.768L20 4"></path></svg>',
        },
    ];

    function currentPage() {
        const path = window.location.pathname;
        for (const item of NAV_ITEMS) {
            if (path.endsWith(item.href) || (item.href === 'index.html' && (path === '/' || path.endsWith('/')))) {
                return item.href;
            }
        }
        if (path.includes('/blog/')) return 'blog.html';
        return '';
    }

    function renderHeader() {
        const active = currentPage();
        const navLinks = NAV_ITEMS.map(item => {
            const isActive = item.href === active;
            const cls = isActive
                ? 'flex items-center gap-2 text-primary font-semibold border-b-2 border-primary pb-1'
                : 'flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors';
            return `<a href="${basePath}${item.href}" class="${cls}">
                <span class="material-symbols-outlined text-xl">${item.icon}</span>
                <span>${item.label}</span>
            </a>`;
        }).join('');

        const mobileLinks = NAV_ITEMS.map(item => {
            const isActive = item.href === active;
            const cls = isActive
                ? 'flex items-center gap-3 px-4 py-3 bg-primary bg-opacity-10 text-primary font-semibold rounded-lg'
                : 'flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors';
            return `<li><a href="${basePath}${item.href}" class="${cls}">
                <span class="material-symbols-outlined">${item.icon}</span>
                <span>${item.label}</span>
            </a></li>`;
        }).join('');

        const el = document.getElementById('site-header');
        if (!el) return;

        el.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden" id="mobile-menu-overlay"></div>
        <div class="fixed top-0 right-0 h-full w-64 bg-background-light dark:bg-background-dark border-l border-gray-200 dark:border-gray-800 z-50 transform translate-x-full transition-transform duration-300 ease-in-out" id="mobile-menu">
            <div class="flex flex-col h-full">
                <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 class="text-gray-800 dark:text-gray-100 text-lg font-bold">Menu</h2>
                    <button class="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white" id="close-mobile-menu">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <nav class="flex-1 p-4 overflow-y-auto">
                    <ul class="space-y-2">${mobileLinks}</ul>
                </nav>
            </div>
        </div>
        <header class="sticky top-0 z-30 bg-background-light dark:bg-background-dark border-b border-solid border-b-gray-200 dark:border-b-gray-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center gap-3 text-gray-800 dark:text-gray-100">
                        <a href="${basePath}index.html" class="flex items-center gap-3 text-inherit no-underline">
                            <div class="size-8 text-primary">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
                                </svg>
                            </div>
                            <h2 class="text-gray-800 dark:text-gray-100 text-xl font-bold leading-tight">Ataberk's Bar</h2>
                        </a>
                    </div>
                    <div class="flex items-center gap-6">
                        <nav class="hidden md:flex items-center space-x-8">
                            ${navLinks}
                        </nav>
                        <button id="theme-toggle" class="p-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors rounded-lg" aria-label="Toggle dark mode">
                            <span class="material-symbols-outlined text-xl dark:hidden">dark_mode</span>
                            <span class="material-symbols-outlined text-xl hidden dark:inline">light_mode</span>
                        </button>
                        <button class="md:hidden text-gray-800 dark:text-gray-100" id="menu-toggle">
                            <span class="material-symbols-outlined text-3xl">menu</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>`;

        const mobileMenu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('mobile-menu-overlay');
        const menuToggle = document.getElementById('menu-toggle');
        const closeBtn = document.getElementById('close-mobile-menu');

        function openMenu() {
            mobileMenu.classList.remove('translate-x-full');
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
        function closeMenu() {
            mobileMenu.classList.add('translate-x-full');
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
        }
        menuToggle.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);

        document.getElementById('theme-toggle').addEventListener('click', function () {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        });
    }

    function renderFooter() {
        const el = document.getElementById('site-footer');
        if (!el) return;

        const variant = el.dataset.variant || 'simple';
        const socialHtml = SOCIAL_LINKS.map(link =>
            `<a class="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors" href="${link.href}" target="_blank" rel="noopener noreferrer">${link.svg}</a>`
        ).join('');

        if (variant === 'full') {
            el.innerHTML = `
            <footer class="flex flex-col gap-4 sm:gap-6 px-2 sm:px-5 py-6 sm:py-10 mt-6 sm:mt-12 text-center border-t border-solid border-gray-200 dark:border-gray-800">
                <div class="flex flex-wrap items-center justify-center gap-6">
                    <div class="flex flex-col items-center">
                        <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-2">Location</h4>
                        <p class="text-gray-500 dark:text-gray-400">Park Yaşam Santorini</p>
                    </div>
                    <div class="flex flex-col items-center">
                        <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-2">Hours</h4>
                        <p class="text-gray-500 dark:text-gray-400">Sat: 17:00 - 03:00</p>
                    </div>
                    <div class="flex flex-col items-center">
                        <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-2">Contact</h4>
                        <p class="text-gray-500 dark:text-gray-400">538 504 4757</p>
                    </div>
                </div>
                <div class="flex flex-wrap justify-center gap-6 mt-4">${socialHtml}</div>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">&copy; 2025 Ataberk Canitez. All Rights Reserved.</p>
            </footer>`;
        } else if (variant === 'social') {
            el.innerHTML = `
            <footer class="flex flex-col gap-6 px-5 py-10 text-center border-t border-solid border-gray-200 dark:border-gray-800">
                <div class="flex flex-wrap justify-center gap-6">${socialHtml}</div>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">&copy; 2025 Ataberk Canitez. All Rights Reserved.</p>
            </footer>`;
        } else {
            el.innerHTML = `
            <footer class="flex flex-col gap-4 sm:gap-6 px-2 sm:px-5 py-6 sm:py-10 mt-6 sm:mt-12 text-center border-t border-solid border-gray-200 dark:border-gray-800">
                <p class="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">&copy; 2025 Ataberk Canitez. All Rights Reserved.</p>
            </footer>`;
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        renderHeader();
        renderFooter();
    });
})();
