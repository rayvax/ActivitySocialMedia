import {makeAutoObservable} from "mobx";

export default class ModalStore
{
    private _content: JSX.Element | null = null;
    private _isOpen = false;

    constructor()
    {
        makeAutoObservable(this);
    }

    public openModal = (content: JSX.Element) =>
    {
        this._content = content;
        this._isOpen = true;
    }

    public closeModal = () =>
    {
        this._content = null;
        this._isOpen = false;
    }

    public get content()
    {
        return this._content;
    }

    public get isOpen()
    {
        return this._isOpen;
    }
}