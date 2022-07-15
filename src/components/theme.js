import { createGlobalStyle } from 'styled-components'

export const lightTheme = {
    bodyColor: "#ffffff",
    textColor: "#000000",
    footerBg: "#f7f7f7",
}

export const darkTheme = {
    bodyColor: "#262626",
    textColor: "#ffffff",
    footerBg: "#1b1b1b",
}

export const GlobalStyles = createGlobalStyle`
    body {
        background: ${(props) => props.theme.bodyColor};
        color: ${(props) => props.theme.textColor};
    }

    .footerBg {
        background: ${(props) => props.theme.footerBg};
    }

    .tab-color .nav-link, .card-title, .title, .admin th, td {
        color: ${(props) => props.theme.textColor} !important;
    }

    .title:hover, .card-title:hover {
        color: ${(props) => props.theme.textColor} !important;
    }
    
    .nav-list, .cardBg, .modal-bg, .review-sec-bg, .list-bg {
        background: ${(props) => props.theme.footerBg} !important;
        color: ${(props) => props.theme.textColor} !important;
    }

    .modal-body-bg {
        background: ${(props) => props.theme.bodyColor};
    }

    .offcanvas-header .btn-close {
        border: 1px solid ${(props) => props.theme.textColor} !important;
    }
`

