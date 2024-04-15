const baseUrl = 'https://hoadondientu.gdt.gov.vn:30000/query/invoices';
const token = () => document.getElementById('token').value;
const formatDate = (dateString, isStart) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const time = isStart ? '00:00:00' : '23:59:59';
    return `${day}/${month}/${year}T${time}`;
};

const fetchAllData = async (invoiceType) => {
    const startDateValue = document.getElementById('startDate').value;
    const endDateValue = document.getElementById('endDate').value;
    const formattedStartDate = formatDate(startDateValue, true);
    const formattedEndDate = formatDate(endDateValue);
    const ketQuaKiemTra = document.getElementById('kqkt').value;

    const getUrl = `${baseUrl}/${invoiceType}?sort=tdlap:desc,khmshdon:asc,shdon:desc&size=10&search=tdlap=ge=${formattedStartDate};tdlap=le=${formattedEndDate};ttxly==${ketQuaKiemTra}`;

    let size = 1;
    const response1 = await fetch(getUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response1.ok) {
        throw new Error('Network response was not ok');
    }

    const data1 = await response1.json();
    size = data1.total;

    const getUrl2 = `${baseUrl}/${invoiceType}?sort=tdlap:desc,khmshdon:asc,shdon:desc&size=${size}&search=tdlap=ge=${formattedStartDate};tdlap=le=${formattedEndDate};ttxly==${ketQuaKiemTra}`;

    const response2 = await fetch(getUrl2, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token()}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response2.ok) {
        throw new Error('Network response was not ok');
    }

    const data2 = await response2.json();

    return data2.datas.map(item => ({
        nbmst: item.nbmst,
        khhdon: item.khhdon,
        shdon: item.shdon,
        khmshdon: item.khmshdon
    }));
};

const fetchData = async (url) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}`);
    }

    return response.blob();
};

const fetchAndZipFiles = async (type) => {
    try {
        $('#loadingModal').modal('show');

        const urls = await fetchAllData(type);

        const zip = new JSZip();
        const batchSize = 1;
        const totalItems = urls.length;

        for (let i = 0; i < totalItems; i += batchSize) {
            const batch = urls.slice(i, i + batchSize);
            const fileBlobs = await Promise.all(batch.map(url => fetchData(url)));
            fileBlobs.forEach((blob, index) => {
                zip.file(`file_${index + i + 1}.zip`, blob);
            });
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = 'combined_files.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        $('#loadingModal').modal('hide');
    } catch (error) {
        console.error('Error:', error);
        $('#loadingModal').modal('hide');
    }
};
