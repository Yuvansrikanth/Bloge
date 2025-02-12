// Setup for modal and cropper
var bs_modal = $('#staticBackdrop');
var image = document.getElementById('preview-image');
var cropper, reader, file;
var isCropperInitialized = false; // Flag to track if the cropper has been initialized

// When the user selects an image to upload
$("body").on("change", "#img", function(e) {
    var files = e.target.files;
    var done = function(url) {
        image.src = url; // Set the image source to preview
        bs_modal.modal('show'); // Show the modal when the image is ready
    };

    if (files && files.length > 0) {
        file = files[0];

        if (URL) {
            done(URL.createObjectURL(file)); // Use URL API to create image object
        } else if (FileReader) {
            reader = new FileReader();
            reader.onload = function(e) {
                done(reader.result); // Use FileReader to load the image
            };
            reader.readAsDataURL(file); // Read the file as DataURL
        }
    }
});

// Initialize the cropper only once when the modal is fully shown (after the image is loaded)
bs_modal.on('shown.bs.modal', function() {
    if (!isCropperInitialized) {
        cropper = new Cropper(image, {
            aspectRatio: 1,
            viewMode: 1,
            preview: '#preview', // Define the preview area
        });
        isCropperInitialized = true; // Set the flag to true to indicate cropper has been initialized
    }
}).on('hidden.bs.modal', function() {
    // Reset cropper when modal is closed
    cropper.destroy();
    cropper = null;
    isCropperInitialized = false; // Reset the flag
});

// Handle cropping and uploading the cropped image
$("#uploadBtn").click(function() {
    var canvas = cropper.getCroppedCanvas({
        width: 150,
        height: 150,
    });

    canvas.toBlob(function(blob) {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
            var base64data = reader.result;
            // Send the cropped image to the server via AJAX
            $.ajax({
                type: "POST",
                dataType: "json",
                url: "/user/edit-profile-image",  // Your server endpoint for uploading
                data: {
                    image: base64data,
                },
                success: function(response) {
                    // Redirect the browser to the provided URL
                    window.location.href = response.redirect;
                },
                error: function(xhr, status, error) {
                    alert("Error uploading image:", error);
                }
            });
        };
    });
});
