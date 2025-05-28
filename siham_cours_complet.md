
# 📘 Cours Complet : Siham — Architecture, Modèles et Données

---

## 🌐 Présentation générale

**Siham** est une application web en mode **SaaS** :

✅ Accessible via internet (https://…)  
✅ Organisée autour d’une suite de **formulaires**  
✅ Affichée dans des **tableaux de bord** selon les droits d’accès (ACL)  
✅ Permet la modification des champs, certains reliant les formulaires entre eux  
✅ Gère des **alertes** sur des dates importantes  
✅ Permet la communication avec l’ASP (Agence de Services et Paiement)  
✅ Permet l’interrogation et la visualisation des données sous forme de flèches, statistiques, requêtes

---

## 🏗️ Structure des bases

La base est structurée en deux grandes familles :

### 1️⃣ **Paramétrage (prefixe `aux_` et `acl_`)**

| Table                       | Rôle                                                        |
|-----------------------------|-------------------------------------------------------------|
| aux_typefiche, aux_typek    | Liste des types de fiches (typefiche) et des types K        |
| aux_blocs, aux_uxtuile      | Définition des dashboards et onglets                        |
| aux_variable                | Liste des variables, reliées aux typeK                      |
| aux_valeur                 | Valeurs pour radio, checkboxes, listes                      |
| aux_alertes, aux_workflow   | Alertes, workflows                                         |
| aux_domaine                | Domaine / sous-domaine                                      |
| acl_*                      | Gestion des droits d’accès                                  |

---

### 2️⃣ **Données (prefixe `tb*`, `tbk*`, `tbmeta`)**

| Table              | Rôle                                                                |
|--------------------|---------------------------------------------------------------------|
| tbk               | Données principales, identifiant K (salarié, jeune, etc.)            |
| tbmeta            | Sous-données liées au K, identifiant N (fiche admin, bilans, etc.)  |
| tbktext, tbktime  | Valeurs des champs selon leur type                                  |

> **Format** : entité / attribut / valeur (EAV)  
> Le paramétrage conserve un modèle relationnel plus classique.

---

## 🔑 Clés principales

| Élément   | Signification                                                                                           |
|-----------|--------------------------------------------------------------------------------------------------------|
| **K**    | Identifiant principal (utilisateur, salarié, partenaire…)                                               |
| **N**    | Identifiant des sous-fiches (fiche administrative, entretien, bilan…)                                   |
| **typeK**| Type de l’entité K (ex : NRTYPEKsalarie, NRTYPEKentite…)                                                |
| **typefiche** | Type technique de la fiche (ex : NRaccueiladmin, NRcomposite…)                                    |
| **vr**   | Variable rattachée au typeK, permet d’historiser les champs et générer statistiques, parcours, flèches  |

---

## 📂 Détails des principales tables

### 📌 aux_typefiche_composition (ATFC)
- Cœur du paramétrage des formulaires.
- Relie à aux_typefiche (typeK, typefiche), aux_zf (ZF).
- Définit quelles variables (vr) sont attachées à quel typefiche.

### 📌 aux_typefiche
- Contient le typefiche (nom technique).
- Relie N à typeK.
- Stocke : typefiche (nom technique de la fiche), nom_affiche de la fiche (nom convivial), categorie (NRaction, NRprojet, NRzfcomp), typeK.

### 📌 tbk
- Contient l’identifiant K.
- Données compilées pour accès rapide.
- Relie aux entités, filtres, noms affichés.

### 📌 tbmeta
- Contient l’identifiant N.
- Relie N à K.
- Stocke : login créateur(admin), date de création, typefiche, état, validation, verrou, statut.


---

## ⚙️ Relations importantes

- **typeK** est créé automatiquement avec **typefiche NRaccueiladmin**.
- Les **vr** sont rattachées aux typeK (pas aux typefiche) pour permettre l’historisation.
- Certaines tables `aux_` ne servent que comme dictionnaires (pour éviter fautes de frappe), d’autres portent des options essentielles.

---

## 🛑 Limitations et choix techniques

- On pourrait se passer de certaines tables dictionnaires, mais avec risque d’erreurs.
- Si on voulait tout stocker uniquement dans `tbmeta`, il manquerait :
    - auto-incrément K
    - typeK et entité
- La colonne `login` n’est pas dans `tbk` car déjà stockée dans `tbmeta` (pour NRaccueiladmin).

---

## 📈 Visualisation et interrogation

- **Flèches (parcours)** : tbgestionparcours, tbprojets, aux_typefiche_ligne_fleche, aux_vrs_dates_fleche
- **Statistiques** : tbxl, aux_stats, velocirapport
- **Requêtes** : tbrequete, tb_ux_requetes

---

## 💬 Exemple pratique (fictif)

| Élément        | Exemple                                                                                          |
|---------------|--------------------------------------------------------------------------------------------------|
| typeK         | NRTYPEKsalarie                                                                                   |
| K            | 10001                                                                                            |
| typefiche    | NRaccueiladmin                                                                                   |
| N            | 50001                                                                                            |
| Variable (vr)| vrNom, vrDateNaissance                                                                            |
| Valeur       | vrNom → "Jean Dupont", vrDateNaissance → "1980-01-15"                                             |
| Table        | Stocké dans tbkvc100 (text), tbkdate (date), relié par N et K                                     |

---

## 📊 Schéma visuel fourni

J’ai généré un schéma visuel pour résumer les relations principales. Il est fourni dans l’image attachée plus haut dans la conversation.

