document.getElementById("userForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const loginId = document.getElementById("loginId").value;
    const password = document.getElementById("password").value;

    // Mobile Validation
    if (!/^\d{10}$/.test(mobile)) {
        alert("Mobile Number must be exactly 10 digits");
        return;
    }

    // Email Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Enter a valid Email Address");
        return;
    }

    // Login ID Validation
    if (!/^[A-Za-z0-9]{8}$/.test(loginId)) {
        alert("Login ID must be exactly 8 alphanumeric characters");
        return;
    }

    // Password Validation
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{6,}$/.test(password)) {
        alert("Password must contain at least 1 uppercase, 1 lowercase, 1 special character and minimum 6 characters");
        return;
    }

    const userData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        mobile: mobile,
        email: email,

        address: {
            street: document.getElementById("street").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            country: document.getElementById("country").value
        },

        loginId: loginId,
        password: password
    };

    try {

        const response = await fetch("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        alert(data.message);

        document.getElementById("userForm").reset();

    } catch (error) {

        alert("Error saving user");

    }

});