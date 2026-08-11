const socket = io();

document.getElementById("userForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const street = document.getElementById("street").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const country = document.getElementById("country").value.trim();
    const loginId = document.getElementById("loginId").value.trim();
    const password = document.getElementById("password").value;

    if (!/^[A-Za-z ]+$/.test(firstName)) {
        alert("First Name should contain only letters");
        return;
    }

    if (!/^[A-Za-z ]+$/.test(lastName)) {
        alert("Last Name should contain only letters");
        return;
    }

    if (!/^\d{10}$/.test(mobile)) {
        alert("Mobile Number must be exactly 10 digits");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Enter a valid Email Address");
        return;
    }

    if (city && !/^[A-Za-z ]+$/.test(city)) {
        alert("City should contain only letters");
        return;
    }

    if (state && !/^[A-Za-z ]+$/.test(state)) {
        alert("State should contain only letters");
        return;
    }

    if (country && !/^[A-Za-z ]+$/.test(country)) {
        alert("Country should contain only letters");
        return;
    }

    if (!/^[A-Za-z0-9]{8}$/.test(loginId)) {
        alert("Login ID must be exactly 8 alphanumeric characters");
        return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{6,}$/.test(password)) {
        alert("Password must contain at least 1 uppercase, 1 lowercase, 1 special character and minimum 6 characters");
        return;
    }

    const userData = {
        firstName,
        lastName,
        mobile,
        email,
        address: {
            street,
            city,
            state,
            country
        },
        loginId,
        password
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

        if (response.ok) {

            socket.emit("joinUser", {
                firstName,
                lastName,
                email
            });

            alert(data.message);

            document.getElementById("userForm").reset();

            setTimeout(() => {
                window.location.href = "live-users.html";
            }, 500);

        } else {

            alert(data.message || "Failed to save user");

        }

    } catch (error) {

        console.error(error);
        alert("Error saving user");

    }

});