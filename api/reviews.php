<?php
require 'cors.php';
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $productId = isset($_GET['product_id']) ? $_GET['product_id'] : null;
        if ($productId) {
            $stmt = $pdo->prepare("SELECT * FROM reviews WHERE product_id = ? ORDER BY date DESC");
            $stmt->execute([$productId]);
            $reviews = $stmt->fetchAll();

            // Adatta i dati per il frontend
            foreach($reviews as &$r) {
                $r['id'] = (string)$r['id'];
                $r['productId'] = (string)$r['product_id'];
                $r['userId'] = (string)$r['user_id'];
                $r['userName'] = $r['user_name'];
            }
            echo json_encode(['success' => true, 'data' => $reviews]);
        }
    }
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->productId) || !isset($data->userId)) {
            throw new Exception("Missing required fields");
        }

        $date = date('Y-m-d');

        $stmt = $pdo->prepare("INSERT INTO reviews (product_id, user_id, user_name, rating, comment, date) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data->productId,
            $data->userId,
            $data->userName,
            $data->rating,
            $data->comment,
            $date
        ]);

        $newId = $pdo->lastInsertId();

        $newReview = [
            'id' => (string)$newId,
            'productId' => (string)$data->productId,
            'userId' => (string)$data->userId,
            'userName' => $data->userName,
            'rating' => $data->rating,
            'comment' => $data->comment,
            'date' => $date
        ];

        echo json_encode(['success' => true, 'data' => $newReview]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>