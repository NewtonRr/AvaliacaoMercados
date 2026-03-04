export const ManagerAreaComponent = () => {
    const handleAddCard = () => {
        console.log('adicionar cartão de avaliação');
    }
    const handleRemoveCard = () => {
        console.log('remover cartão de avaliação');
    }
    const handleEditCard = () => {
        console.log('editar cartão de avaliação');
    }
    return(
        <>
            <div>
                <h1>Área do Gerente</h1>
                <p>Gereciar cartões de avaliação</p>

                <button onClick={() => {handleAddCard()}}>adicionar cartão de avaliação</button>
                <button onClick={() => {handleRemoveCard()}}>remover cartão de avaliação</button>
                <button onClick={() => {handleEditCard()}}>editar cartão de avaliação</button>
            <a href="/review">review</a>
            </div>
        </>
    );
};