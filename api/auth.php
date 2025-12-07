<?php
require 'cors.php';
require 'db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';
$data = json_decode(file_get_contents("php://input"));

try {
    // --- REGISTRAZIONE (Standard) ---
    if ($action === 'register') {
        if (!isset($data->email) || !isset($data->password) || !isset($data->name)) {
            throw new Exception("Incomplete data");
        }

        // Controlla se l'email esiste già
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$data->email]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Email already exists']);
            exit;
        }

        // Hash della password e inserimento
        // IMPORTANTE: PASSWORD_DEFAULT genera un hash di 60 caratteri.
        // Assicurati che la colonna nel DB sia VARCHAR(255)
        $hashedPass = password_hash($data->password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')");
        $stmt->execute([$data->name, $data->email, $hashedPass]);

        $userId = $pdo->lastInsertId();

        echo json_encode([
            'success' => true,
            'data' => [
                'id' => (string)$userId,
                'name' => $data->name,
                'email' => $data->email,
                'role' => 'user'
            ]
        ]);
    }
    // --- LOGIN (Con DEBUG attivo) ---
    elseif ($action === 'login') {
        // Controllo dati in ingresso
        if (!isset($data->email) || !isset($data->password)) {
            echo json_encode(['success' => false, 'message' => 'Debug: Dati mancanti (email o password vuote).']);
            exit;
        }

        // Cerco l'utente
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$data->email]);
        $user = $stmt->fetch();

        // 1. Controllo se l'utente esiste
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'Debug: Email non trovata nel database.']);
            exit;
        }

        // 2. Controllo la password
        $verifica = password_verify($data->password, $user['password']);

        if ($verifica) {
            // TUTTO OK
            echo json_encode([
                'success' => true,
                'data' => [
                    'id' => (string)$user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ]);
        } else {
            // PASSWORD ERRATA - Logghiamo i dettagli per capire il problema
            $hashStart = substr($user['password'], 0, 10);
            $hashLen = strlen($user['password']);

            $msg = "Debug: Password errata. ";
            if ($hashLen < 60) {
                $msg .= "ATTENZIONE: Hash nel DB troppo corto ($hashLen chars)! Probabilmente troncato.";
            } else {
                $msg .= "Hash nel DB OK ($hashLen chars), inizia con '$hashStart...'. Password digitata non corrisponde.";
            }

            echo json_encode(['success' => false, 'message' => $msg]);
        }
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>