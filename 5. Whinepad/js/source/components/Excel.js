import React from 'react';
import PropTypes from 'prop-types';

class Excel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.initialData,
            sortBy: null,
            descending: false,
            edit: null, // {row: index, cell: index}
            search: false
        };

        this._preSearchData = null;
        this._log = [];
        this._currentLogIndex = 0;
        this._saveLog = true;

        this._changeStateBy = this._changeStateBy.bind(this);
        this._sort = this._sort.bind(this);
        this._showEditor = this._showEditor.bind(this);
        this._save = this._save.bind(this);
        this._renderToolbar = this._renderToolbar.bind(this);
        this._renderTable = this._renderTable.bind(this);
        this._renderSearch = this._renderSearch.bind(this);
        this._toggleSearch = this._toggleSearch.bind(this);
        this._search = this._search.bind(this);
    }

    componentDidMount() {
        document.onkeydown = function (e) {
            if (e.altKey && e.shiftKey && e.keyCode === 82) { // ALT + SHIFT + R (replay)
                this._replay();
                return;
            }

            if (e.altKey && e.shiftKey && e.keyCode === 90) { // ALT + SHIFT + Z
                this._changeStateBy(1);
                return;
            }

            if (e.altKey && e.keyCode === 90) { // ALT + Z
                this._changeStateBy(-1);
                return;
            }
        }.bind(this);

        this._log.push(JSON.parse(JSON.stringify(this.state)));
    }

    componentDidUpdate(oldProps, oldState) {
        // guarda o estado atual em um clone
        if (this._saveLog) {
            this._currentLogIndex++;
            this._log.push(JSON.parse(JSON.stringify(this.state)));
        }
    }

    _changeStateBy(idx) {
        this._saveLog = false;

        const logIdx = this._currentLogIndex + idx;

        if (!this._log[logIdx]) {
            console.warn(`No state to replay at index ${logIdx}`);
            return;
        }

        this._currentLogIndex = logIdx
        this.setState(this._log[logIdx], () => this._saveLog = true);
    }

    _replay() {
        if (this._log.length === 0) {
            console.warn('No state to replay yet');
            return;
        }

        let idx = -1;
        const interval = setInterval(function () {
            idx++;

            if (idx === this._log.length - 1) { // fim
                clearInterval(interval);
            }

            this._saveLog = false;
            this.setState(this._log[idx]);
        }.bind(this), 1000);
    }

    _sort(evt) {
        const column = evt.target.cellIndex;
        const descending = this.state.sortBy === column && !this.state.descending;

        const data = Array.from(this.state.data);

        data.sort((a, b) => {
            return descending
                ? (a[column] < b[column] ? 1 : -1)
                : (a[column] > b[column] ? 1 : -1);
        })

        this.setState({ data, descending, sortBy: column });
    }

    _getAlignByCharacterType(word) {
        if (!isNaN(parseInt(word, 10))) {
            return "right";
        }

        return "left";
    }

    _showEditor(evt) {
        this.setState({
            edit: {
                row: parseInt(evt.target.dataset.row, 10),
                cell: evt.target.cellIndex
            }
        });
    }

    _save(evt) {
        evt.preventDefault();
        const input = evt.target.firstChild;
        const data = Array.from(this.state.data);

        data[this.state.edit.row][this.state.edit.cell] = input.value;

        this.setState({ edit: null, data })
    }

    _renderToolbar() {
        return (
            <div className="toolbar">
                <button onClick={this._toggleSearch}>Search</button>
                <a href='data.json' onClick={this._download.bind(this, 'json')}>Export JSON</a>
                <a href='data.csv' onClick={this._download.bind(this, 'csv')}>Export CSV</a>
            </div>
        );
    }

    _toggleSearch() {
        if (this.state.search) {
            this.setState({
                data: this._preSearchData,
                search: false
            });
            this._preSearchData = null;
        } else {
            this._preSearchData = this.state.data;
            this.setState({
                search: true
            });
        }
    }

    _download(format, evt) {
        let contents = '';

        switch (format) {
            case 'json':
                contents = JSON.stringify(this.state.data);
                break;
            case 'csv':
                const data = Array.from(this.state.data);
                const header = Array.from(this.props.headers);

                data.unshift(header);

                contents = data.reduce((result, row) => {
                    return result
                        + row.reduce((rowResult, cell, idx) => {
                            return rowResult
                                + '"'
                                + cell.replace(/"/g, '""')
                                + '"'
                                + (idx < row.length - 1 ? ',' : '');
                        }, '')
                        + '\n';
                }, '');
        }
        
        const URL = window.URL || window.webkitURL;
        const blob = new Blob([contents], {type: 'text/' + format});
        evt.target.href = URL.createObjectURL(blob);
        evt.target.download = 'data.' + format;
    }

    _search(evt) {
        const needle = evt.target.value.toLowerCase();

        if (!needle) { // a string de pesquisa foi apagada
            this.setState({ data: this._preSearchData });
            return;
        }

        const idx = evt.target.dataset.idx; // a coluna a ser pesquisada
        const searchData = this._preSearchData.filter(row => row[idx].toString().toLowerCase().indexOf(needle) > -1);
        this.setState({ data: searchData });
    }

    _renderSearch() {
        if (!this.state.search) {
            return null;
        }

        return (
            <tr onChange={this._search}>
                {this.props.headers.map((_ignore, idx) => (
                    <td key={idx}>
                        <input type='text' data-idx={idx} />
                    </td>
                ))}
            </tr>
        );
    }

    _renderTable() {
        return (
            <table>
                <thead onClick={this._sort}>
                    <tr>
                        {this.props.headers.map((title, idx) => {
                            if (this.state.sortBy === idx) {
                                title += this.state.descending ? ' \u2191' : ' \u2193';
                            }

                            return <th key={idx}>{title}</th>
                        })}
                    </tr>
                </thead>
                <tbody onDoubleClick={this._showEditor}>
                    {this._renderSearch()}
                    {this.state.data.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                            {row.map((cell, idx) => {
                                let content = cell;

                                let edit = this.state.edit;
                                if (edit && edit.row === rowIdx && edit.cell === idx) {
                                    content = <form onSubmit={this._save}>
                                        <input type='text' defaultValue={content} />
                                    </form>
                                }

                                const attrs = {
                                    key: idx,
                                    'data-row': rowIdx,
                                    style: {
                                        textAlign: this._getAlignByCharacterType(cell)
                                    }
                                };

                                return <td {...attrs}>{content}</td>
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    render() {
        return (
            <div className='Excel'>
                {this._renderToolbar()}
                {this._renderTable()}
            </div>
        );
    }
}

Excel.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string),
    initialData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any))
};

export default Excel