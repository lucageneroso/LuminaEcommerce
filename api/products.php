<?php
// --- ABILITA VISUALIZZAZIONE ERRORI (DEBUG) ---
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// ----------------------------------------------

require 'cors.php';
require 'db.php';

$id = isset($_GET['id']) ? $_GET['id'] : null;

try {
    if ($id) {
        // Ottieni singolo prodotto
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch();

        if ($product) {
            // Conversione tipi per React
            $product['price'] = (float)$product['price'];
            $product['rating'] = (float)$product['rating'];
            $product['stock'] = (int)$product['stock'];
            $product['id'] = (string)$product['id'];

            echo json_encode(['success' => true, 'data' => $product]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Product not found']);
        }
    } else {
        // Ottieni tutti i prodotti
        $stmt = $pdo->query("SELECT * FROM products");
        $products = $stmt->fetchAll();

        // Conversione tipi per React
        foreach ($products as &$p) {
            $p['price'] = (float)$p['price'];
            $p['rating'] = (float)$p['rating'];
            $p['stock'] = (int)$p['stock'];
            $p['id'] = (string)$p['id'];
        }

        echo json_encode(['success' => true, 'data' => $products]);
    }
} catch (Exception $e) {
    // In caso di errore, mostralo in formato JSON
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>