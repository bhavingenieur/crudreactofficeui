import * as React from 'react';
import moment from 'moment';
import axios from 'axios';
import './ListItem.css'
import { Announced } from 'office-ui-fabric-react/lib/Announced';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DetailsList, DetailsListLayoutMode, Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { getId, SelectionMode } from 'office-ui-fabric-react/lib/Utilities';
import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  ContextualMenu,
  Checkbox,
  DefaultButton,
  Modal,
  IDragOptions,
  IconButton,
  PrimaryButton
} from 'office-ui-fabric-react';
import { FontSizes } from '@uifabric/styling';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import EditPanel from './EditPanel';

initializeIcons(/* optional base url */);


const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch'
  },
  header: [
    // tslint:disable-next-line:deprecation
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      fontSize: FontSizes.xLarge,
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px'
    }
  ],
  body: {
    flex: '4 4 auto',
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
    selectors: {
      p: {
        margin: '14px 0'
      },
      'p:first-child': {
        marginTop: 0
      },
      'p:last-child': {
        marginBottom: 0
      }
    }
  }
});

const iconButtonStyles = mergeStyleSets({
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px'
  },
  rootHovered: {
    color: theme.palette.neutralDark
  }
});


const exampleChildClass = mergeStyles({
    display: 'block',
    marginBottom: '10px'
});

const iconClass = mergeStyles({
  fontSize: 20,
  height: 20,
  width: 20,
  margin: '0 10px'
});
export default class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this._onFilter = (ev, text) => {
            this.setState({
                items: text ? this._allItems.filter(i => i.dt.toLowerCase().indexOf(text) > -1) : this._allItems
            });
        };
        this._onItemInvoked = (item) => {
            //alert(`Item invoked: ${item.dt}`);
            this.setState({ hideDialog: false, itemtodel : item.dt });
            

        };
        this._selection = new Selection({
            onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() }),
            selectionMode:SelectionMode.single
            
        });
        this._closeModal = () => {
            this.setState({ showModal: false });
        };
        // Populate with items for demos.
        this._allItems = this.props.list ? this.props.list : [ 
            { dt: '2012-09-01T00:00:00.000Z', tm: '1970-01-01T12:30:00.000Z' },
            { dt: '2011-08-07T00:00:00.000Z', tm: '1970-01-01T13:45:00.000Z' },
            { dt: '2020-02-02T00:00:00.000Z', tm: '1970-01-01T12:23:00.000Z' }
        ];

        this._allItems.map( b => {
            b.dt = moment(b.dt).format("dddd, MMMM Do, YYYY");
            b.tm = moment(b.tm).format("hh:mm a")
          })
        
        this._columns = [
            { key: 'date', name: 'Date', fieldName: 'dt', minWidth: 200 },
            { key: 'time', name: 'Time', fieldName: 'tm',minWidth: 200 },
        ];
        this.state = {
            items: this._allItems,
            hideDialog:true,
            selectionDetails: this._getSelectionDetails()
        };
        this._closeDialog = () =>{
          this.props.auth_svc.getUser().then( res=>{
            this.setState({ mail : res.email})
           if(this.state.itemtodel) {
                const payload = { email: this.state.mail, dt : this.state.itemtodel}
                axios.post(`http://localhost:5000/api/deldata`, {payload})
                    .then(() => console.log('Deleted!'))}
                }
              )
          this.setState({hideDialog : true})     
        }
        this._plainclosedialog =() => {
          this.setState({hideDialog : true})   
        }
        this._showeditbox =() =>{
          this.setState({showeditbox:true, hideDialog : true})
        }
        
      
    }
    
    render() {
        const { items, hideDialog, selectionDetails, showeditbox } = this.state;
        const _titleId = getId('title');
        const _subtitleId = getId('subText');      
        
        return (
            
            <React.Fragment>
              { this.state.showeditbox ? <EditPanel auth_s={this.props.auth_svc} secret={this.state.itemtodel}/>: <></>}
            <Fabric>
            <Dialog
          hidden={hideDialog}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: 'Delete Item',
            closeButtonAriaLabel: 'Close',
            subText: 'Do you want to delete this item?'
          }}
        >
          <DialogFooter>
            <PrimaryButton onClick={this._closeDialog} text="Delete" />
            <PrimaryButton onClick={this._showeditbox} text="Edit" />
            <DefaultButton onClick={this._plainclosedialog} text="Cancel" />
          </DialogFooter>
        </Dialog>
            <div className={exampleChildClass}>{selectionDetails}</div>
            <Announced message={selectionDetails} />
            <TextField
              className={exampleChildClass}
              label="Filter by name:"
              onChange={this._onFilter}
              styles={{ root: { maxWidth: '300px' } }}
            />
            <Announced message={`Number of items after filter applied: ${items.length}.`} />
            <MarqueeSelection selection={this._selection}>
              <DetailsList
                items={items}
                columns={this._columns}
                setKey="set"
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.single}
                selection={this._selection}
                selectionPreservedOnEmptyClick={true}
                ariaLabelForSelectionColumn="Toggle selection"
                ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                checkButtonAriaLabel="Row checkbox"
                onItemInvoked={this._onItemInvoked}
              />
            </MarqueeSelection>
          </Fabric>
          </React.Fragment>
        );
    }
    _getSelectionDetails() {
        const selectionCount = this._selection.getSelectedCount();
        switch (selectionCount) {
            case 0:
                return 'No items selected. Please select an item to edit/delete';
            case 1:
                return '1 item selected: ' + this._selection.getSelection()[0].dt + ' Press enter for options';
            default:
                return `${selectionCount} items selected`;
        }
    }
    
  
     
}