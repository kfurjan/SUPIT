const getAlertOnEveryKolegijLoad = () => {
  $("#every-kolegij-load-alert")
    .html(
      `
    <div class="alert alert-danger alert-dismissible fade show text-center" role="alert">
        <strong>Nemoguće dohvatiti podatke o svim kolegijima!</strong>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>`
    )
    .delay(8000)
    .queue(function() {
      $(this).remove();
    });
};

const getAlertOnKolegijFetch = () => {
  $("#kolegij-alert")
    .html(
      `
    <div class="alert alert-danger alert-dismissible fade show text-center" role="alert">
        <strong>Nemoguće dohvatiti podatke o traženom kolegiju!</strong> Provjerite unos i pokušajte još jednom.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>`
    )
    .delay(5000)
    .queue(function() {
      $(this).remove();
    });
};

$(() => {
  let counter = 0;
  let ects = 0;
  let sati = 0;
  let kolegijArr = [];

  // =============================== fill up datalist on page load ========================================

  $.get("http://www.fulek.com/VUA/SUPIT/GetNastavniPlan", result => {
    result.forEach(kolegij => {
      $("#sviKolegiji").append(`<option value="${kolegij.label}">`);
    });
    kolegijArr = result;
  }).fail(() => {
    getAlertOnEveryKolegijLoad();
  });

  // ============================ on one datalist option selection ========================================

  $(".form-group").on("change", "#nazivKolegija", () => {
    // read entered kolegij from input field
    kolegij = $("#nazivKolegija").val();

    try {
      $.get(
        `http://www.fulek.com/VUA/supit/GetKolegij/
        ${kolegijArr.find(kolegijObj => kolegijObj.label == kolegij).value}`,
        kolegij => {
          // add table row
          $(".table tbody").append(`
            <tr>
                <td>${kolegij.kolegij}</td>
                <td>${kolegij.ects}</td>
                <td>${kolegij.sati}</td>
                <td>${kolegij.predavanja}</td>
                <td>${kolegij.vjezbe}</td>
                <td>${kolegij.tip}</td>
                <td><input class="btn btn-danger btn-sm" type="submit" value="Obriši"></td>
            </tr>
          `);

          // update table footer values
          $(".table tfoot").html(`
            <tr>
                <th>Ukupno</th>
                <td>${(ects += kolegij.ects)}</td>
                <td>${(sati += kolegij.sati)}</td>
            </tr>
          `);

          // add header if there are no previous table data
          if (counter === 0) {
            $(".table thead").append(`
              <tr>
                  <th scope="col">Kolegij</th>
                  <th scope="col">ECTS</th>
                  <th scope="col">Sati</th>
                  <th scope="col">P</th>
                  <th scope="col">V</th>
                  <th scope="col">Tip</th>
                  <th scope="col"></th>
              </tr>
            `);
          }
          ++counter;
        }
      ).fail(() => {
        getAlertOnKolegijFetch();
      });
    } catch (e) {
      console.error(
        "Non-existant course has been entered",
        e.name,
        e.message
      );
      getAlertOnKolegijFetch();
    } finally {
      $("#nazivKolegija").val("");
    }
  });

  // ==================================== on delete button click ============================================

  $("table tbody").on("click", ".btn-danger", function() {
    --counter;

    // delete row, get values of deleted row and update table footer values
    deletedRowValues = $(this)
      .parents("tr")
      .remove()
      .text()
      .split("\n");

    $(".table tfoot").html(`
      <tr>
          <th>Ukupno</th>
          <td>${(ects -= deletedRowValues[2])}</td>
          <td>${(sati -= deletedRowValues[3])}</td>
      </tr>
    `);

    // remove table header and footer if there are no table data
    if (counter === 0) {
      $("table > thead tr").remove();
      $("table > tfoot tr").remove();
    }
  });
});
