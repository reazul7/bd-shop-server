const express = require( 'express' )
const app = express()
const cors = require( 'cors' )
const MongoClient = require( 'mongodb' ).MongoClient;
const ObjectId = require( 'mongodb' ).ObjectID;
const port = process.env.PORT || 5055
require( 'dotenv' ).config()
app.use( cors() )
app.use( express.json() )

const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.5ae7d.mongodb.net/${ process.env.DB_NAME }?retryWrites=true&w=majority`;
const client = new MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology: true } );

client.connect( err => {
	const productCollection = client.db( 'bd-shop' ).collection( 'products' );
	const orderCollection = client.db( 'bd-shop' ).collection( 'orders' );
	console.log( 'Database Connected!!' )

	app.post( '/addProduct', ( req, res ) => {
		const newProduct = req.body;
		productCollection.insertOne( newProduct )
			.then( result => {
				res.send( result.insertedCount > 0 )
			} )
	} )

	app.get( '/product', ( req, res ) => {
		productCollection.find()
			.toArray( ( err, sharee ) => {
				res.send( sharee )
			} )
	} )

	app.get( '/manage', ( req, res ) => {
		productCollection.find( {} )
			.toArray( ( err, documents ) => {
				res.send( documents )
			} )
	} )

	app.get( '/product/:id', ( req, res ) => {
		const id = ObjectId( req.params.id )
		productCollection.find( { _id: id } )
			.toArray( ( err, documents ) => {
				res.send( documents[ 0 ] );
			} )
	} )

	app.delete( '/delete/:id', ( req, res ) => {
		const id = ObjectId( req.params.id )
		productCollection.deleteOne( { _id: id } )
			.then( documents => res.send( documents.deletedCount > 0 ) )
	} )

	app.post( '/addOrder', ( req, res ) => {
		const newOrder = req.body;
		orderCollection.insertOne( newOrder )
			.then( result => {
				res.send( result.insertedCount > 0 )
			} )
	} )

	app.get( '/order', ( req, res ) => {
		console.log( 'clicked' )
		orderCollection.find( {} )
			.toArray( ( err, documents ) => {
				console.log( documents );
				res.send( documents )
			} )
	} )
} );

app.get( '/', ( req, res ) => {
	res.send( 'BD Shop Server' )
} )

app.listen( port, () => {
	console.log( `Example app listening at http://localhost:${ port }` )
} )
