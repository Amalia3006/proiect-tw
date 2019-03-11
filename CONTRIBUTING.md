# Cum sa contribui

Pentru a contribui va trebui sa faceti in primul rand un *fork* al depozitului de cod.
Pentru acest lucru va trebui sa accesati cu ajutorul unui browser web [pagina depozitului de cod][proiect-tw] si sa apasati pe butonul **Fork** situat in partea dreapta sus a paginii.

## Propunerea unei solutiei

Mai jos puteti gasi o secventa de pasi pentru a propune o solutie.

1. Aleg un director de lucru

    ```bash
    ~ $ cd ~/facultate/anul-2/semestrul-2/
    ```

2.  Fac o copie locala a depozitului de cod

    ```bash
    ~ $ git clone https://github.com/tuxy_pinguinescu/proiect-tw
    ```

3. Ma mut in directorul copiat

    ```bash
    cd proiect-tw
    ```

4. Ma asigur ca *fork*-ul meu contine ultima versiune a codului

    ```bash
    ~ $ # Adaug o referinta catre depozitul de cod sursa
    ~ $ git remote add upstream https://github.com/bogdan9898/proiect-tw

    ~ $ # Ma pozitionez pe branch-ul `master`
    ~ $ git checkout master

    ~ $ # Obtin ultimile modificari din cadrul depozitului de cod sursa
    ~ $ # upstream - numele remote-ului pe care l-am adaugat
    ~ $ # master - branch-ul care ma intereseaza
    ~ $ git pull upstream master

    ~ $ # Actualizez informatiile din cadrul fork-ului meu
    ~ $ git push origin master
    ```

5. Adaug un *branch* nou special pentru modulul la care lucrez

    ```bash
    git checkout -b loginGUI
    ```

## Cum sa va propuneti solutia

Dupa redactarea fisierelor ce reprezinta solutia pentru unul dintre module va trebui sa incapsulati acele modificari in cadrul unui *commit*.

Pentru inceput trebuie sa selectati si sa adaugati toate modificarile care va intereseaza.

```bash
~ $ git status     # pentru a vedea starea curenta a depozitului de cod
~ $ git add fisier # pentru fiecare fisier pe care dorim sa il adaugam
~ $ git status     # pentru a verifica ca toate resursele pe care le dorim sunt prezente
```

Un exemplu de rezultat al comenzilor de mai sus ar putea fi:

```bash
On branch loginGUI
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    new file:   solutii/tuxy_pinguinescu/README.md
    new file:   solutii/tuxy_pinguinescu/controllerLogin.js
    new file:   solutii/tuxy_pinguinescu/modelLogin.js
    new file:   solutii/tuxy_pinguinescu/viewLogin.js

```

Dupa ce am adaugat toate modificarile pe care le dorim putem sa le incapsulam intr-un commit folosind urmatoarea comanda:

```
~ $ git commit -m "Mesajul pe care dorim sa il atasam acestor modificari"
```

Pentru a urca aceste modificari in cadrul depozitului de cod de pe Github puteti folosi comanda `git push`.

```bash
# origin - este referinta catre fork-ul nostru
# loginGUI - este numele branch-ului in cadrul caruia am redactat solutia
~ $ git push origin loginGUI
```

Dupa ce ati trimis modificarile propuse catre fork-ul vostru, va trebui sa deschideti un *Pull request* catre [depozitul de cod sursa][proiect-tw].

Pentru a face acest lucru va trebui sa accesati pagina destinata branch-urilor din cadrul depozitului vostru de cod.
Pentru Tuxy Pinguinescu aceasta pagina este `https://github.com/tuxy_pinguinescu/proiect-tw/branches`.

In cadrul acestei pagini vor fi afisate toate *branch*-urile existente In cadrul depozitului vostru de cod cu o serie de actiuni pentru fiecare dintre ele. In cazul nostru actiunea care ne intereseaza este **New pull request**.
