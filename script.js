const API_KEY = "YOUR_API_KEY"; // <-- thay bằng API KEY Gemini của bạn

async function processImage() {
    const fileInput = document.getElementById("imageInput");
    const resultDiv = document.getElementById("result");

    if (!fileInput.files.length) {
        resultDiv.innerHTML = "<p>Vui lòng chọn ảnh trước.</p>";
        return;
    }

    resultDiv.innerHTML = "<p>🔄 Đang xử lý ảnh bằng Gemini API...</p>";

    const imageFile = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: "Nâng cấp ảnh lên 4K, giữ nguyên khuôn mặt, tăng chi tiết, làm nét sắc." },
                                {
                                    inline_data: {
                                        mime_type: imageFile.type,
                                        data: await toBase64(imageFile)
                                    }
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!data || !data.candidates) {
            resultDiv.innerHTML = "<p>❌ Lỗi: API không trả dữ liệu (có thể sai API key).</p>";
            return;
        }

        const outputImage = data.candidates[0].content.parts[0].text;
        resultDiv.innerHTML = `<img src="${outputImage}" style="width:60%;border-radius:10px;">`;

    } catch (err) {
        console.error(err);
        resultDiv.innerHTML = "<p>❌ Lỗi khi kết nối API.</p>";
    }
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
    });
}
