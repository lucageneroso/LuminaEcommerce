# Lumina E-Commerce

**Lumina** è una Single Page Application (SPA) modulare per l'e-commerce, progettata con un'architettura full-stack disaccoppiata. Il progetto integra un frontend reattivo in React con un backend solido in PHP nativo e un database MySQL.

---

## 🚀 Tecnologie Utilizzate

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS.
* **Backend:** PHP (Vanilla), PDO per la sicurezza del database.
* **Database:** MySQL.
* **Iconografia:** Lucide-React.

---

## 🏗️ Architettura del Sistema

L'applicazione segue un modello **Client-Server disaccoppiato**, garantendo una separazione netta tra la logica di presentazione e la gestione dei dati.

### 1. Frontend (React)
Il frontend gestisce la navigazione tramite `react-router-dom` e la logica di business attraverso componenti modulari organizzati per funzionalità (Catalog, Auth, Cart, Wishlist).

### 2. Backend (PHP API)
Il backend è composto da una serie di endpoint RESTful in PHP che comunicano esclusivamente tramite JSON.

* **Sicurezza:** Viene utilizzato **PDO** con prepared statements per prevenire attacchi SQL Injection.
* **CORS:** Un middleware dedicato (`cors.php`) gestisce le intestazioni Cross-Origin per permettere la comunicazione tra il client (porta 3000) e il server (porta 80/8000).

---

## 📊 Gestione dei Dati

La gestione dello stato e della persistenza dei dati è suddivisa su tre livelli strategici.

### 1. Stato Globale (React Context API)
Invece di librerie esterne (come Redux), l'applicazione utilizza la **Context API** di React per gestire lo stato globale e prevenire il "prop drilling". I componenti utilizzano hook personalizzati come `useAuth()` o `useShop()` per accedere ai dati.

| Context | Responsabilità |
| :--- | :--- |
| **`AuthContext.tsx`** | Mantiene lo stato dell'utente loggato (`user`). Fornisce le funzioni `login()` e `logout()`. Lo stato persiste in `localStorage`. |
| **`ShopContext.tsx`** | Gestisce lo stato del carrello (`cart`) e della `wishlist`, calcola i totali e fornisce le funzioni per manipolare gli elementi (es. `addToCart`, `toggleWishlist`). |

### 2. Persistenza Locale (LocalStorage)
Per migliorare l'esperienza utente, i dati del carrello e la sessione utente vengono sincronizzati con il `localStorage` del browser, garantendo che non vadano persi al refresh della pagina.

### 3. Persistenza Remota (MySQL)
I dati critici sono salvati permanentemente sul database:
* **Prodotti:** Informazioni su prezzi, stock e categorie.
* **Utenti:** Credenziali protette tramite hashing (`password_hash`).
* **Wishlist:** Sincronizzata tra database e frontend; i prodotti salvati vengono recuperati automaticamente al login successivo grazie alla logica di sincronizzazione in `ShopContext`.

---

## 🔒 Gestione del Backend (PHP)

Il backend è minimale ma sicuro, concentrandosi sull'accesso ai dati.

### Sicurezza e Autenticazione
* **Database (PDO):** La connessione è gestita in `db.php`. Tutte le query utilizzano Prepared Statements (es. `prepare("SELECT ... WHERE email = ?")`) per prevenire SQL Injection.
* **Auth (`auth.php`):**
    * **Registrazione:** Le password vengono salvate tramite `password_hash()` (algoritmo BCRYPT/ARGON2).
    * **Login:** La verifica avviene tramite `password_verify()`.

### Struttura del Database (Schema Logico)

| Tabella | Contenuto | Relazioni Chiave |
| :--- | :--- | :--- |
| **`users`** | Dati utente (ID, nome, hash password). | - |
| **`products`** | Catalogo prodotti. | - |
| **`reviews`** | Recensioni prodotti. | `products(id)`, `users(id)` |
| **`wishlist`** | Prodotti preferiti per utente. | `products(id)`, `users(id)`<br>*(Relazione Many-to-Many con vincolo UNIQUE)* |

---

## 🛠️ Installazione e Configurazione

Segui questi passaggi per avviare il progetto in locale.

### 1. Database
1.  Crea un database MySQL chiamato `lumina_ecommerce`.
2.  Importa lo schema SQL fornito (che creerà le tabelle `users`, `products`, `reviews`, `wishlist`).

### 2. Backend (PHP)
1.  Sposta i file della cartella `api/` nella root del tuo server locale (es. `C:\xampp\htdocs\api`).
2.  Configura le credenziali del database nel file `api/db.php`.

### 3. Frontend (React)
1.  Installa le dipendenze:
    ```bash
    npm install
    ```
2.  Configura l'URL del backend nel file `services/mockApi.ts`:
    ```typescript
    const USE_MOCK = false;
    const BASE_URL = 'http://localhost/api';
    ```
3.  Avvia l'applicazione:
    ```bash
    npm run dev
    ```
