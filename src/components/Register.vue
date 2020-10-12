<template>
    <div>
        <h4>Register</h4>
        <form>
            <label for="first_name">First Name</label>
            <div>
                <input id="first_name" type="text" v-model="first_name" required autofocus>
            </div>
            <label for="last_name">Last Name</label>
            <div>
                <input id="last_name" type="text" v-model="last_name" required autofocus>
            </div>
            <label for="phone">Mobile Number</label>
            <div>
                <input id="phone" type="phone" v-model="mobile_num" required>
            </div>
            <label for="password">Password</label>
            <div>
                <input id="password" type="password" v-model="password" required>
            </div>
            <label for="password-confirm">Confirm Password</label>
            <div>
                <input id="password-confirm" type="password" v-model="password_confirmation" required>
            </div>
            <label></label>
            <div>
                <button type="submit" @click="handleSubmit">
                    Register
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
    label {
        margin-top: 5px;
    }
</style>

<script>
    const config = require('config');
    export default {
        props : ["nextUrl"],
        data(){
            return {
                first_name : "",
                last_name : "",
                mobile_num : "",
                password : "",
                password_confirmation : ""
            }
        },
        methods : {
            handleSubmit(e) {
                e.preventDefault()

                if (this.password === this.password_confirmation && this.password.length > 3)
                {
                    fetch(`${config.authUrl}/register`, {
                            method: 'post',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                User: {
                                    FirstName: this.first_name,
                                    LastName: this.last_name,
                                    MobileNum: this.mobile_num,
                                    Password: this.password
                                }
                            })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if(data.auth) {
                            localStorage.setItem('user',JSON.stringify(data.user))
                            localStorage.setItem('jwt',data.token)

                            if (localStorage.getItem('jwt') != null){
                                this.$emit('loggedIn')
                                if(this.$route.params.nextUrl != null){
                                    this.$router.push(this.$route.params.nextUrl)
                                }
                                else{
                                    this.$router.push('/')
                                }
                            }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
                } else {
                    this.password = ""
                    this.passwordConfirm = ""

                    return alert("Passwords do not match")
                }
            }
        }
    }
</script>