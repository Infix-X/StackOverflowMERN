
    
        $(function() {
            $("form").submit(function(e) {
                e.preventDefault();
                var FirstName = $("#FirstName").val();
                var LastName = $("#LastName").val();
                var Email = $("#Email").val();
                var Password = $("#Password").val();
                $("pre").html('FirstName: ' + FirstName +
                             '<br>Last Name: ' + LastName +
                             '<br>Email: ' + Email +
                             '<br>Password: ' + Password);
                return false;
            });
        });
    