<?php 
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        
        $name = trim($_POST["name"]);
        $email = trim($_POST["email"]);
        $message = trim($_POST["message"]);

        if ($name == "" OR $email == "" OR $message == "") {
            $error_message = "Error! Error! Error! No name, email or message!";
        }

        require 'class.phpmailer.php';

        $mail = new PHPMailer();

        if (!isset($error_message)) {
            $email_body = "";
            $email_body = $email_body . "Name: " . $name . "<br>";
            $email_body = $email_body . "Email: " . $email . "<br>";
            $email_body = $email_body . "Message: " . $message;

            $mail->SetFrom($email, $name);
            $mail->AddAddress('pollardld@yahoo.com', 'David Pollard');
            $mail->Subject = "Contact from pollardld site" . $name;
            $mail->MsgHTML($email_body); 

            if($mail->Send()) {
                header("Location: mail.php?status=thanks");
                exit;
            } else {
              $error_message = "Robot says: " . $mail->ErrorInfo;
            }
        }
    }
?><?php 
    include('inc/header.php'); ?>
    
    <nav>
        <a href="http://pollardld.com#contact" class="icon-home"></a>
    </nav>

	<section class="mail">    

        <?php if (isset($_GET["status"]) AND $_GET["status"] == "thanks") { ?>
            <p>Thanks for the email!</p>
            <p><a href="index.php#contact">Return to pollarld.com<br /><i class="icon-home"></i></a></p>
        <?php } else { ?>

        <?php
            if (!isset($error_message)) {
                echo '';
            } else {
                echo '<p class="message">' . $error_message . '</p>';
            }
        ?>

            <article class="info">
                <h1>Ptalk To Me</h1>
                <p>Oh hia, i am david pollard</p>
                <p>Send me a message!</p>
            </article>

            <form method="post" action="mail.php">
                <input placeholder="name" type="text" name="name" id="name" value="<?php if (isset($name)) { echo htmlspecialchars($name); } ?>">
                <input placeholder="email" type="text" name="email" id="email" value="<?php if (isset($name)) { echo htmlspecialchars($email); } ?>">
                <textarea placeholder="message" name="message" id="message"><?php if (isset($message)) { echo htmlspecialchars($message); } ?></textarea>
                <button type="submit" id="submit-button"><i class="icon-envelope"></i></button>
            </form>

            <?php } ?>

        </section>

<?php include('inc/footer.php') ?>
