// User Authentication Functions
async function signUp() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!firstName || !lastName || !email || !password) {
        alert('Please fill all fields');
        return;
    }

    try {
        console.log('🎮 Creating user account...');
        
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            balance: 0,
            todayEarnings: 0,
            totalEarnings: 0,
            gamesPlayed: 0,
            referralCode: generateReferralCode(),
            joinedDate: new Date(),
            country: 'Pakistan',
            currency: 'PKR',
            lastLogin: new Date(),
            status: 'active',
            totalWithdrawals: 0
        };

        await db.collection('users').doc(user.uid).set(userData);
        
        await db.collection('notifications').add({
            type: 'new_user',
            firstName: firstName,
            lastName: lastName,
            email: email,
            userId: user.uid,
            timestamp: new Date(),
            message: `New user: ${firstName} ${lastName} (${email})`
        });

        alert('🎮 Account created! Start playing and earning 900 PKR daily.');
        window.location.href = 'playgame.html';
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert('Welcome back to Play&Win!');
        window.location.href = 'playgame.html';
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function generateReferralCode() {
    return 'PW' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User logged in:', user.email);
    }
});
