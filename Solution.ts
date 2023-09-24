/*Solution

SOLID Principles:
Single Responsibility Principle: La clase LibraryManager se ocupa únicamente de la lógica de la biblioteca, mientras que el servicio EmailService se ocupa del envío de correos electrónicos.
Open/Closed Principle: Las clases están abiertas para extensión (por ejemplo, añadiendo más tipos de notificaciones) pero cerradas para modificación.
Liskov Substitution Principle: User implementa la interfaz IObserver, lo que significa que se puede sustituir por cualquier otro objeto que también implemente la interfaz.
Dependency Inversion Principle: Se inyecta IEmailService en LibraryManager, lo que significa que LibraryManager no depende de una implementación concreta.

Inyección de Dependencias:
Inyectar IEmailService en LibraryManager.

Lambda Expressions:
Usar expresiones lambda en funciones como find y forEach.

Singleton Pattern:
Garantizar que solo haya una instancia de LibraryManager con el método getInstance.

Observer Pattern:
Los usuarios (User) se registran como observadores y son notificados cuando se añade un nuevo libro.

Builder Pattern:
Se utiliza para construir instancias de Book de una manera más limpia y escalable.

Refactorización:
eliminar el uso de ANY mejorar el performance

Aspectos (Opcional)
Puedes anadir logs de info, warning y error en las llamadas, para un mejor control

Diseño por Contrato (Opcional):
Puedes anadir validaciones en precondiciones o postcondiciones como lo veas necesario*/

interface IBook {
    title: string;
    author: string;
    ISBN: string;
}

interface IEmailService {
    sendEmail(email: string, message: string): void;
}

class EmailService implements IEmailService {
    sendEmail(email: string, message: string): void {
        console.log(`Sending email to ${email}: ${message}`);
        // Real email sending code would go here
    }
}

class Book implements IBook {
    constructor(public title: string, public author: string, public ISBN: string) {}
}

class BookBuilder {
    private title: string = '';
    private author: string = '';
    private ISBN: string = '';

    setTitle(title: string): BookBuilder {
        this.title = title;
        return this;
    }

    setAuthor(author: string): BookBuilder {
        this.author = author;
        return this;
    }

    setISBN(ISBN: string): BookBuilder {
        this.ISBN = ISBN;
        return this;
    }

    build(): Book {
        return new Book(this.title, this.author, this.ISBN);
    }
}

interface IObserver {
    notify(message: string): void;
}

class Loan {
    constructor(public ISBN: string, public userID: string, public date: Date) {}
}

class LibraryManager {
    private books: Book[] = [];
    private loans: Loan[] = [];
    private static instance: LibraryManager;
    private emailService: IEmailService;

    private constructor(emailService: IEmailService) {
        this.emailService = emailService;
    }

    // Singleton
    public static getInstance(emailService: IEmailService): LibraryManager {
        if (!this.instance) {
            this.instance = new LibraryManager(emailService);
        }
        return this.instance;
    }

    // Observer pattern
    private observers: IObserver[] = [];

    addObserver(observer: IObserver) {
        this.observers.push(observer);
    }

    private notifyAll(message: string) {
        this.observers.forEach(observer => observer.notify(message));
    }

    addBook(book: Book) {
        this.books.push(book);
        this.notifyAll(`New book added: ${book.title}`);
    }

    loanBook(ISBN: string, userID: string) {
        const book = this.books.find(b => b.ISBN === ISBN);
        if (book) {
            this.loans.push(new Loan(ISBN, userID, new Date()));
            this.emailService.sendEmail(userID, `You borrowed the book ${book.title}`);
        }
    }

    // You can add other methods (removeBook, returnBook, etc.) adjusting where necessary.
}

class User implements IObserver {
    constructor(public id: string, public email: string) {
        LibraryManager.getInstance(new EmailService()).addObserver(this);
    }

    notify(message: string) {
        console.log(`User ${this.id} notified: ${message}`);
    }
}

const library = LibraryManager.getInstance(new EmailService());
const user1 = new User('user01', 'user01@example.com');
const book1 = new BookBuilder()
    .setTitle("The Great Gatsby")
    .setAuthor("F. Scott Fitzgerald")
    .setISBN("123456789")
    .build();

library.addBook(book1);
library.loanBook("123456789", "user01@example.com");
