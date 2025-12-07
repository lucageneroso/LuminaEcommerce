<?php
require 'cors.php';
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    // --- 1. RECUPERA WISHLIST (GET) ---
    if ($method === 'GET') {
        $userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;

        if ($userId) {
            // Join con la tabella products per avere tutti i dettagli (immagine, prezzo, ecc.)
            $sql = "SELECT p.*, w.added_at
                    FROM products p
                    JOIN wishlist w ON p.id = w.product_id
                    WHERE w.user_id = ?";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([$userId]);
            $items = $stmt->fetchAll();

            // Conversione tipi per React
            foreach ($items as &$p) {
                $p['price'] = (float)$p['price'];
                $p['rating'] = (float)$p['rating'];
                $p['stock'] = (int)$p['stock'];
                $p['id'] = (string)$p['id'];
            }

            echo json_encode(['success' => true, 'data' => $items]);
        } else {
            throw new Exception("User ID required");
        }
    }
    // --- 2. AGGIUNGI/RIMUOVI (POST) ---
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->userId) || !isset($data->productId) || !isset($data->action)) {
            throw new Exception("Missing data");
        }

        if ($data->action === 'add') {
            // Usa INSERT IGNORE per ignorare se esiste già
            $stmt = $pdo->prepare("INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)");
            $stmt->execute([$data->userId, $data->productId]);
            echo json_encode(['success' => true, 'message' => 'Added']);
        }
        elseif ($data->action === 'remove') {
            $stmt = $pdo->prepare("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$data->userId, $data->productId]);
            echo json_encode(['success' => true, 'message' => 'Removed']);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>