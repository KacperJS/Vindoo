# Vindoo – Interaktywny Dashboard Inwestycyjny

## Opis projektu

Vindoo to nowoczesna aplikacja webowa zaprojektowana z myślą o zarządzaniu projektami inwestycyjnymi za pomocą interaktywnej mapy. Projekt umożliwia:

- Interaktywne zarządzanie projektami na mapie:
  - Dodawanie projektów poprzez kliknięcie na mapie, co pozwala precyzyjnie określić lokalizację.
  - Wyświetlanie projektów w trzech kategoriach:
    - **Aktywne** – wyświetlane jako zielone pinezki.
    - **Zakończone** – wyświetlane jako czerwone pinezki.
    - **Potencjalne tematy** – wyświetlane jako żółte pinezki, służące do rejestrowania wstępnych pomysłów oraz notatek.
- Upload i powiększanie zdjęć:
  - Użytkownik może dołączać zdjęcia główne do projektów, a po kliknięciu na miniaturkę wyświetla się powiększony obraz.
- Zadania i zarządzanie projektami:
  - Możliwość dodawania i monitorowania zadań przypisanych do poszczególnych projektów, co pozwala na lepsze śledzenie postępu prac.
- Generowanie profili klientów:
  - System umożliwia tworzenie szczegółowych profili klientów, zawierających dane kontaktowe, historię projektów oraz dodatkowe informacje biznesowe.
- Wyszukiwanie i filtrowanie:
  - Wbudowany mechanizm wyszukiwania pozwala na filtrowanie pinezek na mapie po różnych kryteriach (np. imię i nazwisko inwestora, adres, produkt czy status projektu).

## Technologie

Projekt został zbudowany z wykorzystaniem nowoczesnych narzędzi i technologii, które gwarantują wysoką wydajność oraz atrakcyjny interfejs użytkownika:

- **React** – główna biblioteka do budowy interfejsu użytkownika.
- **React Router DOM** – obsługa routingu i nawigacji w aplikacji.
- **React-Leaflet & Leaflet** – integracja map OpenStreetMap, wyświetlanie interaktywnych pinezek oraz niestandardowych ikon.
- **Supabase**:
  - **PostgreSQL** – baza danych przechowująca projekty, potencjalne tematy, zadania i profile klientów.
  - **Authentication** – bezpieczne logowanie i zarządzanie użytkownikami.
  - **Storage** – obsługa uploadu zdjęć oraz zarządzanie plikami.
  - **Row-Level Security (RLS)** – zaawansowane zabezpieczenia dostępu do danych.
- **Vite** – narzędzie do szybkiej budowy i serwowania aplikacji.
- **SCSS** – zaawansowane, modułowe stylowanie aplikacji.
- **Dodatkowe biblioteki**:
  - **uuid** – generowanie unikalnych identyfikatorów.
  - **react-dropzone** – obsługa drag & drop dla uploadu zdjęć.
  - **react-icons** – zestaw nowoczesnych ikon.

## Wyszukiwanie pinezek

Aplikacja umożliwia wyszukiwanie pinezek na mapie po różnych kryteriach, takich jak:

- Imię i nazwisko inwestora (pole `name` lub `contacts.name`)
- Adres
- Produkt
- Tytuł potencjalnego projektu lub komentarz

Mechanizm wyszukiwania filtruje dane pobrane z bazy w czasie rzeczywistym, dzięki czemu użytkownik może szybko odnaleźć interesujące rekordy.

## Dodawanie zadań i generowanie profili klientów

- **Zadania**:
  - Każdy projekt może mieć przypisane zadania, co pozwala na monitorowanie postępu prac.
  - Użytkownik może dodawać, edytować oraz usuwać zadania przypisane do projektu.
- **Profile klientów**:
  - System umożliwia tworzenie szczegółowych profili klientów, które zawierają dane kontaktowe, historię projektów oraz dodatkowe informacje biznesowe.
  - Profile te ułatwiają zarządzanie relacjami z klientami.

## Projekt jest dostępny w wersji live na Vercel:

https://vindoo.vercel.app/
