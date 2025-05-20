# Projeto Intensivão Java Spring - Maio/25

Este projeto foi desenvolvido durante o Intensivão Java Spring, edição de maio de 2025, ministrado por **Nélio Alves** do **DevSuperior**.



Este projeto representa um passo importante na minha jornada para a carreira backend Java, uma área com grande demanda e excelentes oportunidades no mercado de desenvolvimento.


Obrigado a todos!

## Visão Geral


![Logo](images/dslist.png)



O `dslist` é uma aplicação backend construída com Java e o framework Spring Boot. O objetivo principal deste projeto é fornecer funcionalidades para gerenciar listas de jogos, permitindo a criação de listas personalizadas e a organização dos jogos dentro dessas listas. Ele segue a arquitetura de uma **API RESTful**, permitindo que os clientes interajam com os dados dos jogos através de requisições HTTP. Vamos entender como ele funciona:

A aplicação oferece as seguintes funcionalidades:

* Listar todos os jogos.
* Buscar detalhes de um jogo específico pelo seu ID.
* Listar todas as listas de jogos.
* Listar os jogos pertencentes a uma lista específica.
* Permitir a movimentação de jogos entre diferentes posições dentro de uma mesma lista.

## Tecnologias Utilizadas

* **Java:** Linguagem de programação principal.
* **Spring Boot:** Framework Java para desenvolvimento rápido de aplicações web e microsserviços.
* **Spring Web:** Módulo do Spring para construir aplicações web.
* **Spring Data JPA:** Módulo do Spring para simplificar o acesso e a manipulação de dados com o JPA (Java Persistence API).
* **Hibernate:** Implementação do JPA utilizada pelo Spring Data JPA.
* **H2 Database (em memória):** Banco de dados relacional em memória utilizado para desenvolvimento e testes.
* **Lombok:** Biblioteca Java para reduzir a quantidade de código boilerplate.
* **Maven:** Ferramenta de gerenciamento de dependências e build.

## Resumo da Estrutura do Projeto

A estrutura do projeto segue as convenções do Spring Boot, organizada em pacotes para separar as responsabilidades:

* `com.devsuperior.dslist`: Pacote principal da aplicação.
* `com.devsuperior.dslist.config`: Contém classes de configuração, como a configuração de CORS (`WebConfig`).
* `com.devsuperior.dslist.controllers`: Contém os controladores REST que expõem os endpoints da API (`GameController`, `GameListController`).
* `com.devsuperior.dslist.dto`: Contém os Data Transfer Objects (DTOs) utilizados para transportar dados entre a API e a camada de serviço (`GameDTO`, `GameListDTO`, `GameMinDTO`, `ReplacementDTO`).
* `com.devsuperior.dslist.entities`: Contém as classes de entidade que representam as tabelas do banco de dados (`Belonging`, `BelongingPK`, `Game`, `GameList`).
* `com.devsuperior.dslist.projections`: Contém interfaces que definem projeções para consultas JPQL (`GameMinProjection`).
* `com.devsuperior.dslist.repositories`: Contém as interfaces de repositório que estendem `JpaRepository` para acesso aos dados (`GameListRepository`, `GameRepository`).
* `com.devsuperior.dslist.services`: Contém as classes de serviço que implementam a lógica de negócios da aplicação (`GameListService`, `GameService`).

---

## Estrutura e Tecnologias do Projeto

O projeto é desenvolvido em Java e utiliza o framework Spring Boot, que facilita a criação de aplicações Spring prontas para produção. Veja os principais componentes e tecnologias envolvidas:

* **`pom.xml` (Maven Project Object Model):** Este arquivo define as dependências do projeto, o processo de build e metadados.
    * **`spring-boot-starter-parent`**: Fornece configurações padrão para projetos Spring Boot.
    * **`spring-boot-starter-data-jpa`**: Habilita a **JPA (Java Persistence API)** para interação com o banco de dados, usando o **Hibernate** como ferramenta ORM (Mapeamento Objeto-Relacional).
    * **`spring-boot-starter-web`**: Inclui dependências para construir aplicações web, incluindo **APIs RESTful**, usando Spring MVC.
    * **`h2database` (H2)**: Um banco de dados em memória usado para desenvolvimento e testes (`scope=runtime`). Isso significa que ele está disponível durante a execução, mas não é empacotado na implantação final.
    * **`postgresql`**: Um banco de dados relacional de código aberto popular, também usado para produção (`scope=runtime`).
    * **`spring-boot-starter-test`**: Oferece utilitários para testar aplicações Spring Boot.
    * **`java.version`**: Definido como `21`, indicando a versão do JDK (Java Development Kit) utilizada.
* **Maven Wrapper (`mvnw`, `mvnw.cmd`):** Scripts que permitem compilar o projeto sem ter o Maven instalado globalmente em sua máquina. Eles baixam uma versão específica do Maven se necessário.
* **`DslistApplication.java`**: É o ponto de entrada principal da aplicação Spring Boot. A anotação `@SpringBootApplication` combina `@Configuration`, `@EnableAutoConfiguration` e `@ComponentScan`, tornando-o uma aplicação Spring Boot típica.
* **`Game` (Entidade):**
    * Localizada em `com.devsuperior.dslist.entities`.
    * Representa um jogo no banco de dados.
    * Anotada com `@Entity` e `@Table(name = "tb_game")` para mapeá-la à tabela `tb_game`.
    * Usa `@Id` e `@GeneratedValue(strategy = GenerationType.IDENTITY)` para geração automática de ID.
    * Inclui campos como `title`, `year`, `genre`, `platforms`, `score`, `imgUrl`, `shortDescription` e `longDescription`.
    * `@Column(name = "game_year")` mapeia explicitamente o campo `year` para uma coluna chamada `game_year`.
    * `@Column(columnDefinition = "TEXT")` é usado para `shortDescription` e `longDescription` para permitir entradas de texto mais longas no banco de dados.
* **`GameMinDTO` (Objeto de Transferência de Dados - DTO):**
    * Localizada em `com.devsuperior.dslist.dto`.
    * Uma representação simplificada de uma entidade `Game`, contendo apenas `id`, `title`, `year`, `imgUrl` e `shortDescription`.
    * DTOs são usados para transferir dados entre camadas (por exemplo, da camada de serviço para o controlador) e para expor apenas as informações necessárias ao cliente, melhorando a segurança e o desempenho.
* **`GameRepository` (Repositório):**
    * Localizada em `com.devsuperior.dslist.repositories`.
    * Uma interface que estende `JpaRepository`, fornecendo operações CRUD (Criar, Ler, Atualizar, Excluir) padrão para a entidade `Game` sem a necessidade de escrever código repetitivo.
* **`GameService` (Serviço):**
    * Localizada em `com.devsuperior.dslist.services`.
    * Anotada com `@Service`, indicando que é um componente de lógica de negócios.
    * Usa `@Autowired` para injetar `GameRepository`.
    * Contém o método `findAll()`, que recupera todas as entidades `Game` do banco de dados, as converte em objetos `GameMinDTO` e retorna uma lista desses DTOs. Essa transformação garante que apenas os dados mínimos necessários sejam expostos.
* **`GameController` (Controlador):**
    * Localizada em `com.devsuperior.dslist.controllers`.
    * Anotada com `@RestController` e `@RequestMapping(value = "/games")`, indicando que é um controlador REST que lida com requisições para o endpoint `/games`.
    * Usa `@Autowired` para injetar `GameService`.
    * A anotação `@GetMapping` no método `findAll()` mapeia as requisições HTTP GET para `/games` a este método, que então chama o `GameService` para buscar os dados do jogo e retorná-los ao cliente.
* **`application.properties` e `application-test.properties`:**
    * Arquivos de configuração para a aplicação Spring Boot.
    * `application-test.properties` é específico para o perfil de `test`.
        * **Conexão H2:** Configura um banco de dados H2 em memória para testes.
        * **Console H2:** Habilita o console H2 para visualizar o conteúdo do banco de dados durante o desenvolvimento (`/h2-console`).
        * **Mostrar SQL:** Configura o Hibernate para exibir as instruções SQL geradas no console.
    * `application.properties`:
        * `spring.profiles.active=test`: Define o perfil ativo como `test`, o que significa que `application-test.properties` será usado por padrão.
        * `spring.jpa.open-in-view=false`: Uma configuração comum em APIs REST para evitar problemas de carregamento lento (lazy loading) fora de uma transação.
        * `spring.h2.console.settings.web-allow-others=true`: Permite conexões remotas ao console H2, útil em algumas configurações de desenvolvimento.
        * `cors.origins`: Define as origens permitidas para o Compartilhamento de Recursos de Origem Cruzada (CORS), permitindo que aplicações frontend de URLs específicas acessem a API.
* **`import.sql`:** Este arquivo (localizado em `src/main/resources`) é executado automaticamente pelo Spring Boot/Hibernate quando a aplicação é iniciada, se um banco de dados em memória como o H2 for usado. É tipicamente usado para preencher o banco de dados com dados iniciais para desenvolvimento e testes.

---

### 1. Dinâmica de Funcionamento


Aqui está um passo a passo de como o projeto funciona:

*  **Inicialização da Aplicação:** Quando a aplicação `DslistApplication` é executada, o Spring Boot inicializa o contexto da aplicação. Ele procura por componentes como controladores, serviços e repositórios.
*  **Inicialização do Banco de Dados (para o perfil `test`):**
    * Como `spring.profiles.active=test` e o H2 está configurado, o Spring Boot configura um banco de dados H2 em memória.
    * O script `import.sql` é executado, preenchendo a tabela `tb_game` com dados iniciais de jogos.
*  **Requisição do Cliente:** Um cliente (por exemplo, um navegador web ou uma aplicação frontend) envia uma requisição HTTP GET para `http://vmlinuxd:8080/games` (assumindo a porta padrão do Spring Boot 8080).
*  **Invocação do Controlador:** O `GameController` recebe esta requisição devido às suas anotações `@RequestMapping(value = "/games")` e `@GetMapping`.
*  **Chamada à Camada de Serviço:** O `GameController` então delega a requisição ao `GameService` chamando seu método `findAll()`.
*  **Interação com o Repositório:** O `GameService`, por sua vez, chama o método `findAll()` do `GameRepository`. Este método (fornecido por `JpaRepository`) executa uma consulta SQL para recuperar todos os registros da tabela `tb_game` no banco de dados.
*  **Conversão de Entidade para DTO:** O `GameRepository` retorna uma `List<Game>` (uma lista de entidades `Game`). O `GameService` então processa esta lista, convertendo cada entidade `Game` em um objeto `GameMinDTO`. Isso é feito usando um *stream* e a operação `map`, seguida por `toList()` para coletar os resultados. Isso garante que dados sensíveis ou desnecessários não sejam expostos ao cliente.
*  **Resposta ao Cliente:** O `GameService` retorna a `List<GameMinDTO>` para o `GameController`. O `GameController` então serializa esta lista em uma resposta JSON (JavaScript Object Notation) e a envia de volta ao cliente.

Em resumo, este projeto oferece uma **API de backend** simples, mas eficaz, para gerenciar uma lista de jogos, demonstrando conceitos essenciais do Spring Boot, como **controladores REST, serviços, repositórios, entidades JPA, DTOs e integração com banco de dados.**


### 2. Modelagem de Dados (Entidades)

O projeto possui um modelo de dados relacional mapeado para objetos Java usando JPA (Java Persistence API) com Hibernate:

* **`Game.java`**: Representa um jogo no banco de dados (`tb_game`), contendo informações detalhadas como título, ano, gênero, plataformas, pontuação, URLs de imagem e descrições.
* **`GameList.java`**: Representa uma lista de jogos (`tb_game_list`), com um ID e um nome.
* **`Belonging.java`**: Representa a relação muitos-para-muitos entre `Game` e `GameList`, indicando que um jogo pertence a uma lista. Contém um campo `position` para ordenar os jogos dentro de uma lista.
* **`BelongingPK.java`**: É uma classe `@Embeddable` que serve como chave primária composta para a entidade `Belonging`, contendo referências a `Game` e `GameList`.

### 3. Camada de Repositórios

* **`GameRepository.java`**: Estende `JpaRepository`, fornecendo métodos CRUD básicos para a entidade `Game`. Contém uma consulta nativa (`@Query`) para buscar jogos que pertencem a uma lista específica, ordenados pela posição, retornando uma `GameMinProjection`.
* **`GameListRepository.java`**: Também estende `JpaRepository`, fornecendo métodos CRUD para a entidade `GameList`. Inclui um método `@Modifying` com `@Query` para atualizar a posição de um jogo dentro de uma lista.

### 4. Camada de Serviços

A camada de serviço contém a lógica de negócios e orquestra as operações com os repositórios:

* **`GameService.java`**:
    * `findById(Long id)`: Busca um jogo pelo ID e retorna um `GameDTO` (uma versão mais completa dos dados do jogo).
    * `findAll()`: Retorna uma lista de todos os jogos, mapeados para `GameMinDTO` (uma versão resumida dos dados do jogo).
    * `findByGameList(Long listId)`: Busca todos os jogos pertencentes a uma lista específica, utilizando a projeção `GameMinProjection` para otimizar a consulta e mapeando-os para `GameMinDTO`.
* **`GameListService.java`**:
    * `findAll()`: Retorna uma lista de todas as listas de jogos, mapeadas para `GameListDTO`.
    * `move(Long listId, int sourceIndex, int destinationIndex)`: Este é um método transacional complexo que permite reordenar os jogos dentro de uma lista. Ele recupera os jogos da lista, remove o jogo da posição de origem, insere-o na posição de destino e, em seguida, atualiza as posições de todos os jogos afetados no banco de dados.

### 5. Camada de DTOs (Data Transfer Objects)

DTOs são usados para transferir dados entre as camadas da aplicação (por exemplo, do serviço para o controlador) e para expor apenas os dados necessários aos clientes:

* **`GameDTO.java`**: Representação completa de um `Game` para detalhes específicos de um jogo.
* **`GameMinDTO.java`**: Representação mínima de um `Game`, usada para listagens rápidas. Pode ser criada a partir de uma entidade `Game` ou de uma `GameMinProjection`.
* **`GameListDTO.java`**: Representação de uma `GameList`, contendo apenas o ID e o nome.
* **`ReplacementDTO.java`**: Usado para receber os índices de origem e destino ao mover um jogo dentro de uma lista.

### 6. Camada de Controladores (APIs RESTful)

Os controladores expõem os endpoints da API, recebendo requisições HTTP e retornando respostas:

* **`GameController.java`**:
    * `GET /games`: Retorna uma lista de todos os jogos (`List<GameMinDTO>`).
    * `GET /games/{id}`: Retorna os detalhes completos de um jogo específico pelo seu ID (`GameDTO`).
* **`GameListController.java`**:
    * `GET /lists`: Retorna uma lista de todas as listas de jogos (`List<GameListDTO>`).
    * `GET /lists/{listId}/games`: Retorna os jogos que pertencem a uma lista específica, ordenados pela posição (`List<GameMinDTO>`).
    * `POST /lists/{listId}/replacement`: Permite reordenar os jogos dentro de uma lista. Recebe um `ReplacementDTO` no corpo da requisição com os índices de origem e destino.

### 7. Configuração Adicional

* **`WebConfig.java`**: Configura o **CORS (Cross-Origin Resource Sharing)**, permitindo que aplicações frontend de domínios específicos (definidos na propriedade `cors.origins` nos arquivos `.properties`) acessem a API.
* **Arquivos de Propriedades (`application.properties`, `application-test.properties`, etc.)**:
    * `spring.datasource.url`, `username`, `password`: Definem as credenciais e URL do banco de dados (H2 para `test`, PostgreSQL para `dev`/`prod`).
    * `spring.h2.console.enabled=true` e `spring.h2.console.path=/h2-console`: Habilitam o console H2 para visualizar o banco de dados em memória.
    * `spring.jpa.show-sql=true`: Mostra as queries SQL geradas pelo Hibernate no console.
    * `spring.jpa.hibernate.ddl-auto=none`: Indica que o Hibernate não deve gerenciar automaticamente o esquema do banco de dados (o que é comum em produção, onde o esquema é gerenciado manualmente ou por scripts de migração).


## Como Executar a Aplicação

1.  **Pré-requisitos:**
    * Java Development Kit (JDK) 17 ou superior instalado.
    * Maven instalado.

2.  **Clonar o Repositório (se aplicável):**
    ```bash
    git clone https://github.com/fabiuniz/dslist-rest.git
    cd dslist
    ```

3.  **Executar a Aplicação:**
    Você pode executar a aplicação de duas maneiras:

    * **Usando o Maven:**
        ```bash
        mvn spring-boot:run
        ```

    * **Executando a classe principal:**
        Localize a classe `DslistApplication.java` dentro do pacote `com.devsuperior.dslist` e execute-a como uma aplicação Java em sua IDE (IntelliJ IDEA, Eclipse, etc.).

4.  **Acessar a API:**
    Após a aplicação ser iniciada, você poderá acessar os endpoints da API através de ferramentas como o Postman, Insomnia ou um navegador web. Alguns endpoints de exemplo:

    * `GET /games`: Lista todos os jogos em formato `GameMinDTO`.
    * `GET /games/{id}`: Busca os detalhes do jogo com o ID especificado em formato `GameDTO`.
    * `GET /lists`: Lista todas as listas de jogos em formato `GameListDTO`.
    * `GET /lists/{listId}/games`: Lista os jogos da lista com o ID especificado em formato `GameMinDTO`.
    * `POST /lists/{listId}/replacement`: Permite mover um jogo de uma posição para outra dentro da lista especificada (requer um corpo JSON com `sourceIndex` e `destinationIndex`).

## Agradecimentos

Gostaria de expressar minha profunda gratidão:

* A **Nélio Alves** e toda a equipe da **DevSuperior** por criarem um treinamento tão completo e prático como o Intensivão Java Spring. A clareza das explicações e a abordagem focada em projetos são inestimáveis para o aprendizado.


Este projeto é um resultado direto do conhecimento e das ferramentas disponibilizadas durante o Intensivão Java Spring. Muito obrigado!









clear; mvn clean install ; mvn spring-boot:run