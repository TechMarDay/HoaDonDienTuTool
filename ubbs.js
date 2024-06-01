function handleError(errorMessage) {
    // Update the content of the modal body with the error message
    document.getElementById('errorModalBody').innerHTML = errorMessage;

    // Show the modal
    $('#errorModal').modal('show');
}

function closeError(){
    $('#errorModal').modal('hide');
}

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const captcha = document.getElementById('captcha').value;
    const ckey = localStorage.getItem('ckey'); // Assuming this is static or predefined

    const body = {
        username: username,
        password: password,
        cvalue: captcha,
        ckey: ckey
    };

    try {
        const response = await fetch('https://hoadondientu.gdt.gov.vn:30000/security-taxpayer/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token; // Assuming the token is in the 'token' field
            localStorage.setItem('token', token);
            localStorage.setItem('tokeExpired', Date.now());
            localStorage.setItem('username', username);
            // Do something with the token, e.g., store it or redirect to another page
            document.getElementById('loginForm').style.display = 'none'; // Hide the login form
            document.getElementById('successMessage').style.display = 'block'; // Show the success message
            location.reload();
        } else {
            handleError("Đăng nhập không thành công, vui lòng kiểm tra lại thông tin đăng nhập!");

        }
    } catch (error) {
        handleError("Đăng nhập không thành công, vui lòng kiểm tra lại thông tin đăng nhập!");
    }
});

function checkTokenExpired() {
    const token = localStorage.getItem('token');
    const tokenExpired = localStorage.getItem('tokeExpired');
    const twentyFourHoursLater = tokenExpired + (24 * 60 * 60 * 1000);
    if (token && tokenExpired && Date.now() < twentyFourHoursLater) {
        document.getElementById('loginForm').style.display = 'none'; // Hide the login form
        document.getElementById('successMessage').style.display = 'block'; // Show the success message
        document.getElementById('btnLogout').style.display = 'block';

    }
    else {
        document.getElementById('btnPurchasedInvoices').disabled = true;
        document.getElementById('btndownloadpurchasedexcel').disabled = true;
        document.getElementById('btnSoldInvoices').disabled = true;
        document.getElementById('btndownloadSaledexcel').disabled = true;
        document.getElementById('spRequiredLoginPurchase').style.display = 'block'; // Show the success message
        document.getElementById('spRequiredLoginSale').style.display = 'block'; // Show the success message
    }
}


checkTokenExpired();



