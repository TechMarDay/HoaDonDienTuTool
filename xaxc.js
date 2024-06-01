async function fetchAndRenderSVG() {
    try {
        const response = await fetch('https://hoadondientu.gdt.gov.vn:30000/captcha');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        localStorage.setItem('ckey', data.key);
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        const img = new Image();
        const svgBlob = new Blob([data.content], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);

            // Here you can implement OCR or manual checking
            // For demonstration, I'm just logging that the image was loaded
            console.log('SVG rendered on canvas');
        };
        img.src = url;
    } catch (error) {
        console.error('Error fetching and rendering SVG:', error);
        handleError("Xảy ra lỗi khi đăng nhập, vui lòng thử lại")
    }
}

fetchAndRenderSVG();