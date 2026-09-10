/* =========================================================
   QRLY APP
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    const menuButton = document.getElementById("mobileMenuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuButton && navLinks) {

        menuButton.addEventListener("click", () => {

            const isOpen = navLinks.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                isOpen
            );

            menuButton.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';

        });


        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.innerHTML =
                    '<i class="fa-solid fa-bars"></i>';

            });

        });

    }


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries, obs) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            obs.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach(element => {
            observer.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* =====================================================
       QR GENERATOR
       ===================================================== */

    const qrContainer =
        document.getElementById("qrcode");

    if (!qrContainer) return;


    let currentType = "url";
    let currentLogo = null;

    let currentSettings = {

        foreground: "#111111",
        background: "#ffffff",
        size: 280,
        correction: "M"

    };


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const dynamicFields =
        document.getElementById("dynamicFields");

    const foregroundColor =
        document.getElementById("foregroundColor");

    const backgroundColor =
        document.getElementById("backgroundColor");

    const foregroundValue =
        document.getElementById("foregroundValue");

    const backgroundValue =
        document.getElementById("backgroundValue");

    const qrSize =
        document.getElementById("qrSize");

    const sizeValue =
        document.getElementById("sizeValue");

    const logoUpload =
        document.getElementById("logoUpload");

    const logoPreview =
        document.getElementById("logoPreview");

    const logoImage =
        document.getElementById("logoImage");

    const logoName =
        document.getElementById("logoName");

    const removeLogo =
        document.getElementById("removeLogo");

    const qrLogoOverlay =
        document.getElementById("qrLogoOverlay");

    const qrLogoOverlayImage =
        document.getElementById("qrLogoOverlayImage");


    /* =====================================================
       FIELD TEMPLATES
       ===================================================== */

    const fieldTemplates = {

        /* ================= URL ================= */

        url: `
            <label class="form-label" for="qrInput">
                Website URL
            </label>

            <input
                type="url"
                id="qrInput"
                class="qr-input"
                placeholder="https://example.com"
                value="https://qrly.app"
            >

            <span class="input-hint">
                Enter the URL you want people to scan.
            </span>
        `,


        /* ================= TEXT ================= */

        text: `
            <label class="form-label" for="qrInput">
                Text
            </label>

            <textarea
                id="qrInput"
                class="qr-input"
                rows="4"
                placeholder="Write your message here..."
            >Hello from QRLY.</textarea>

            <span class="input-hint">
                Create a QR code containing any text.
            </span>
        `,


        /* ================= EMAIL ================= */

        email: `
            <div class="dynamic-field">

                <label for="emailAddress">
                    Email address
                </label>

                <input
                    type="email"
                    id="emailAddress"
                    class="dynamic-input"
                    placeholder="hello@example.com"
                >

            </div>

            <div class="dynamic-field">

                <label for="emailSubject">
                    Subject
                </label>

                <input
                    type="text"
                    id="emailSubject"
                    class="dynamic-input"
                    placeholder="Hello!"
                >

            </div>

            <div class="dynamic-field">

                <label for="emailBody">
                    Message
                </label>

                <textarea
                    id="emailBody"
                    class="dynamic-input"
                    rows="3"
                    placeholder="Your message..."
                ></textarea>

            </div>
        `,


        /* ================= PHONE ================= */

        phone: `
            <label class="form-label" for="phoneNumber">
                Phone number
            </label>

            <input
                type="tel"
                id="phoneNumber"
                class="dynamic-input"
                placeholder="+92 300 1234567"
            >

            <span class="input-hint">
                Include the country code for best results.
            </span>
        `,


        /* ================= WI-FI ================= */

        wifi: `
            <div class="dynamic-field">

                <label for="wifiName">
                    Network name
                </label>

                <input
                    type="text"
                    id="wifiName"
                    class="dynamic-input"
                    placeholder="My Wi-Fi"
                >

            </div>

            <div class="dynamic-field">

                <label for="wifiPassword">
                    Password
                </label>

                <input
                    type="text"
                    id="wifiPassword"
                    class="dynamic-input"
                    placeholder="Wi-Fi password"
                >

            </div>

            <div class="dynamic-field">

                <label for="wifiSecurity">
                    Security
                </label>

                <select
                    id="wifiSecurity"
                    class="dynamic-input"
                >

                    <option value="WPA">
                        WPA / WPA2
                    </option>

                    <option value="WEP">
                        WEP
                    </option>

                    <option value="nopass">
                        No password
                    </option>

                </select>

            </div>
        `,


        /* ================= VCARD ================= */

        vcard: `
            <div class="dynamic-field">

                <label for="cardName">
                    Full name
                </label>

                <input
                    type="text"
                    id="cardName"
                    class="dynamic-input"
                    placeholder="John Doe"
                >

            </div>

            <div class="dynamic-field">

                <label for="cardPhone">
                    Phone
                </label>

                <input
                    type="tel"
                    id="cardPhone"
                    class="dynamic-input"
                    placeholder="+92 300 1234567"
                >

            </div>

            <div class="dynamic-field">

                <label for="cardEmail">
                    Email
                </label>

                <input
                    type="email"
                    id="cardEmail"
                    class="dynamic-input"
                    placeholder="john@example.com"
                >

            </div>

            <div class="dynamic-field">

                <label for="cardCompany">
                    Company
                </label>

                <input
                    type="text"
                    id="cardCompany"
                    class="dynamic-input"
                    placeholder="Your Company"
                >

            </div>
        `
    };


    /* =====================================================
       GET QR CONTENT
       ===================================================== */

    function getQRContent() {

        switch (currentType) {

            /* ================= URL ================= */

            case "url": {

                return (
                    document
                        .getElementById("qrInput")
                        ?.value
                        .trim()
                    || "https://qrly.app"
                );

            }


            /* ================= TEXT ================= */

            case "text": {

                return (
                    document
                        .getElementById("qrInput")
                        ?.value
                        .trim()
                    || "Hello from QRLY"
                );

            }


            /* ================= EMAIL ================= */

            case "email": {

                const email =
                    document
                        .getElementById("emailAddress")
                        ?.value
                        .trim()
                    || "hello@example.com";

                const subject =
                    document
                        .getElementById("emailSubject")
                        ?.value
                        .trim()
                    || "";

                const body =
                    document
                        .getElementById("emailBody")
                        ?.value
                        .trim()
                    || "";


                let content =
                    `mailto:${email}`;

                const params = [];

                if (subject) {

                    params.push(
                        `subject=${encodeURIComponent(subject)}`
                    );

                }

                if (body) {

                    params.push(
                        `body=${encodeURIComponent(body)}`
                    );

                }

                if (params.length) {

                    content +=
                        "?" +
                        params.join("&");

                }

                return content;

            }


            /* ================= PHONE ================= */

            case "phone": {

                const phone =
                    document
                        .getElementById("phoneNumber")
                        ?.value
                        .trim()
                    || "+923001234567";

                return `tel:${phone}`;

            }


            /* ================= WI-FI ================= */

            case "wifi": {

                const ssid =
                    document
                        .getElementById("wifiName")
                        ?.value
                        .trim()
                    || "My Wi-Fi";

                const password =
                    document
                        .getElementById("wifiPassword")
                        ?.value
                        .trim()
                    || "";

                const security =
                    document
                        .getElementById("wifiSecurity")
                        ?.value
                    || "WPA";


                return (
                    `WIFI:T:${security};` +
                    `S:${escapeWifi(ssid)};` +
                    `P:${escapeWifi(password)};;`
                );

            }


            /* ================= VCARD ================= */

            case "vcard": {

                const name =
                    document
                        .getElementById("cardName")
                        ?.value
                        .trim()
                    || "John Doe";

                const phone =
                    document
                        .getElementById("cardPhone")
                        ?.value
                        .trim()
                    || "+923001234567";

                const email =
                    document
                        .getElementById("cardEmail")
                        ?.value
                        .trim()
                    || "hello@example.com";

                const company =
                    document
                        .getElementById("cardCompany")
                        ?.value
                        .trim()
                    || "QRLY";


                return [
                    "BEGIN:VCARD",
                    "VERSION:3.0",
                    `FN:${escapeVCard(name)}`,
                    `TEL:${escapeVCard(phone)}`,
                    `EMAIL:${escapeVCard(email)}`,
                    `ORG:${escapeVCard(company)}`,
                    "END:VCARD"
                ].join("\n");

            }


            default:

                return "https://qrly.app";

        }

    }


    /* =====================================================
       ESCAPING
       ===================================================== */

    function escapeWifi(value) {

        return value
            .replace(/\\/g, "\\\\")
            .replace(/;/g, "\\;")
            .replace(/,/g, "\\,")
            .replace(/:/g, "\\:");

    }


    function escapeVCard(value) {

        return value
            .replace(/\\/g, "\\\\")
            .replace(/;/g, "\\;")
            .replace(/,/g, "\\,")
            .replace(/\n/g, "\\n");

    }


    /* =====================================================
       GENERATE QR
       ===================================================== */

    function generateQR() {

        if (typeof QRCode === "undefined") {

            console.error(
                "QRCode library is not loaded."
            );

            return;

        }


        qrContainer.innerHTML = "";


        const content =
            getQRContent();


        try {

            new QRCode(
                qrContainer,
                {

                    text: content,

                    width:
                        currentSettings.size,

                    height:
                        currentSettings.size,

                    colorDark:
                        currentSettings.foreground,

                    colorLight:
                        currentSettings.background,

                    correctLevel:
                        getCorrectionLevel()

                }
            );


            updateLogoOverlay();

        } catch (error) {

            console.error(
                "QR generation failed:",
                error
            );

        }

    }


    /* =====================================================
       ERROR CORRECTION
       ===================================================== */

    function getCorrectionLevel() {

        if (
            typeof QRCode === "undefined" ||
            !QRCode.CorrectLevel
        ) {

            return 1;

        }


        switch (
            currentSettings.correction
        ) {

            case "L":
                return QRCode.CorrectLevel.L;

            case "Q":
                return QRCode.CorrectLevel.Q;

            case "H":
                return QRCode.CorrectLevel.H;

            default:
                return QRCode.CorrectLevel.M;

        }

    }


    /* =====================================================
       QR TYPE SWITCHING
       ===================================================== */

    document
        .querySelectorAll(".qr-tab")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".qr-tab")
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );

                        });


                    button.classList.add(
                        "active"
                    );


                    currentType =
                        button.dataset.type;


                    dynamicFields.innerHTML =
                        fieldTemplates[
                            currentType
                        ];


                    attachDynamicListeners();


                    generateQR();

                }
            );

        });


    /* =====================================================
       DYNAMIC INPUT LISTENERS
       ===================================================== */

    function attachDynamicListeners() {

        const inputs =
            dynamicFields.querySelectorAll(
                "input, textarea, select"
            );


        inputs.forEach(input => {

            input.addEventListener(
                "input",
                generateQR
            );

            input.addEventListener(
                "change",
                generateQR
            );

        });

    }


    attachDynamicListeners();


    /* =====================================================
       COLORS
       ===================================================== */

    if (
        foregroundColor &&
        foregroundValue
    ) {

        foregroundColor.addEventListener(
            "input",
            () => {

                currentSettings.foreground =
                    foregroundColor.value;


                foregroundValue.textContent =
                    foregroundColor.value.toUpperCase();


                generateQR();

            }
        );

    }


    if (
        backgroundColor &&
        backgroundValue
    ) {

        backgroundColor.addEventListener(
            "input",
            () => {

                currentSettings.background =
                    backgroundColor.value;


                backgroundValue.textContent =
                    backgroundColor.value.toUpperCase();


                generateQR();

            }
        );

    }


    /* =====================================================
       SIZE
       ===================================================== */

    if (
        qrSize &&
        sizeValue
    ) {

        qrSize.addEventListener(
            "input",
            () => {

                currentSettings.size =
                    Number(qrSize.value);


                sizeValue.textContent =
                    `${qrSize.value}px`;


                generateQR();

            }
        );

    }


    /* =====================================================
       ERROR CORRECTION BUTTONS
       ===================================================== */

    document
        .querySelectorAll(".correction")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".correction")
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );

                        });


                    button.classList.add(
                        "active"
                    );


                    currentSettings.correction =
                        button.dataset.level;


                    generateQR();

                }
            );

        });


    /* =====================================================
       LOGO UPLOAD
       ===================================================== */

    if (logoUpload) {

        logoUpload.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];


                if (!file) return;


                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload = event => {

                    currentLogo =
                        event.target.result;


                    logoImage.src =
                        currentLogo;


                    qrLogoOverlayImage.src =
                        currentLogo;


                    logoName.textContent =
                        file.name;


                    logoPreview.classList.remove(
                        "hidden"
                    );


                    qrLogoOverlay.classList.remove(
                        "hidden"
                    );

                };


                reader.readAsDataURL(
                    file
                );

            }
        );

    }


    /* =====================================================
       REMOVE LOGO
       ===================================================== */

    if (removeLogo) {

        removeLogo.addEventListener(
            "click",
            () => {

                currentLogo = null;

                logoUpload.value = "";

                logoPreview.classList.add(
                    "hidden"
                );

                qrLogoOverlay.classList.add(
                    "hidden"
                );

                logoImage.src = "";

                qrLogoOverlayImage.src = "";

            }
        );

    }


    function updateLogoOverlay() {

        if (currentLogo) {

            qrLogoOverlayImage.src =
                currentLogo;

            qrLogoOverlay.classList.remove(
                "hidden"
            );

        } else {

            qrLogoOverlay.classList.add(
                "hidden"
            );

        }

    }


    /* =====================================================
       DOWNLOAD PNG
       ===================================================== */

    const downloadPng =
        document.getElementById(
            "downloadPng"
        );


    if (downloadPng) {

        downloadPng.addEventListener(
            "click",
            () => {

                const canvas =
                    qrContainer.querySelector(
                        "canvas"
                    );

                const image =
                    qrContainer.querySelector(
                        "img"
                    );


                const source =
                    canvas || image;


                if (!source) return;


                const exportCanvas =
                    document.createElement(
                        "canvas"
                    );


                const padding = 40;


                exportCanvas.width =
                    currentSettings.size +
                    padding * 2;


                exportCanvas.height =
                    currentSettings.size +
                    padding * 2;


                const context =
                    exportCanvas.getContext(
                        "2d"
                    );


                context.fillStyle =
                    currentSettings.background;


                context.fillRect(
                    0,
                    0,
                    exportCanvas.width,
                    exportCanvas.height
                );


                if (canvas) {

                    context.drawImage(
                        canvas,
                        padding,
                        padding
                    );


                    finishPngDownload(
                        exportCanvas
                    );

                } else {

                    const img =
                        new Image();


                    img.onload = () => {

                        context.drawImage(
                            img,
                            padding,
                            padding
                        );


                        finishPngDownload(
                            exportCanvas
                        );

                    };


                    img.src =
                        source.src;

                }

            }
        );

    }


    function finishPngDownload(canvas) {

        const link =
            document.createElement(
                "a"
            );


        link.download =
            "qrly-qr-code.png";


        link.href =
            canvas.toDataURL(
                "image/png"
            );


        link.click();

    }


    /* =====================================================
       DOWNLOAD SVG
       ===================================================== */

    const downloadSvg =
        document.getElementById(
            "downloadSvg"
        );


    if (downloadSvg) {

        downloadSvg.addEventListener(
            "click",
            () => {

                const size =
                    currentSettings.size;


                const bg =
                    currentSettings.background;


                const canvas =
                    qrContainer.querySelector(
                        "canvas"
                    );


                if (!canvas) return;


                const data =
                    canvas.toDataURL(
                        "image/png"
                    );


                const svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${size}"
     height="${size}"
     viewBox="0 0 ${size} ${size}">

    <rect
        width="100%"
        height="100%"
        fill="${bg}"
    />

    <image
        href="${data}"
        width="${size}"
        height="${size}"
        preserveAspectRatio="none"
    />

</svg>
                `.trim();


                const blob =
                    new Blob(
                        [svg],
                        {
                            type:
                                "image/svg+xml"
                        }
                    );


                const url =
                    URL.createObjectURL(
                        blob
                    );


                const link =
                    document.createElement(
                        "a"
                    );


                link.href = url;

                link.download =
                    "qrly-qr-code.svg";


                link.click();


                URL.revokeObjectURL(
                    url
                );

            }
        );

    }


    /* =====================================================
       RESET
       ===================================================== */

    const resetGenerator =
        document.getElementById(
            "resetGenerator"
        );


    if (resetGenerator) {

        resetGenerator.addEventListener(
            "click",
            () => {

                currentType = "url";

                currentLogo = null;


                currentSettings = {

                    foreground:
                        "#111111",

                    background:
                        "#ffffff",

                    size:
                        280,

                    correction:
                        "M"

                };


                /* Reset tabs */

                document
                    .querySelectorAll(".qr-tab")
                    .forEach(button => {

                        button.classList.toggle(
                            "active",
                            button.dataset.type ===
                                "url"
                        );

                    });


                /* Reset fields */

                dynamicFields.innerHTML =
                    fieldTemplates.url;


                attachDynamicListeners();


                /* Reset colors */

                foregroundColor.value =
                    "#111111";

                backgroundColor.value =
                    "#ffffff";


                foregroundValue.textContent =
                    "#111111";

                backgroundValue.textContent =
                    "#FFFFFF";


                /* Reset size */

                qrSize.value = 280;

                sizeValue.textContent =
                    "280px";


                /* Reset correction */

                document
                    .querySelectorAll(".correction")
                    .forEach(button => {

                        button.classList.toggle(
                            "active",
                            button.dataset.level ===
                                "M"
                        );

                    });


                /* Reset logo */

                logoUpload.value = "";

                logoPreview.classList.add(
                    "hidden"
                );

                qrLogoOverlay.classList.add(
                    "hidden"
                );

                logoImage.src = "";

                qrLogoOverlayImage.src = "";


                generateQR();

            }
        );

    }


    /* =====================================================
       INITIAL GENERATION
       ===================================================== */

    generateQR();

});
